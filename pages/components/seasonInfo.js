import {useEffect, useState} from 'react'
import Loading from './loadingScreen';
import CircularProgress from '@mui/material/CircularProgress';

const SeasonInfo = ({id, season_number}) =>{

    const [seasonInfomation, setSeasonInformation] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [checking, setChecking] = useState(false)

    const Img_Url = "https://image.tmdb.org/t/p/w300"
    const apiKey = "?api_key=4e73e1dfa07d9055c678d3e4ad6ac341"
    const url = "https://api.themoviedb.org/3/tv/"
    
    const fullUrl = url + id + '/season/' + season_number + apiKey


    var options = {
        method: 'GET',
        headers:{
        'Authorization': '4e73e1dfa07d9055c678d3e4ad6ac341',
        'Content-Type': 'application/json'
        }
    }

    const fetchSeasonInfo = async(url) =>{
        setChecking(true)
        const getSeasonInfo = await fetch(url, options);
        const response = await getSeasonInfo.json()
        const finalResponse = await response.episodes
        setSeasonInformation(finalResponse)
        setChecking(false)
    }

    useEffect( async() => {
        await fetchSeasonInfo(fullUrl)
    }, [])


    if(isLoading){
        return( 
        <Loading setIsLoading={setIsLoading}/>
        )
    }

    return(
        <>
            <div>
                {checking ? <CircularProgress /> : <div>{seasonInfomation.map((season) =>{
                    const {id, name, overview, still_path, episode_number} = season;
                    return(
                        <div key={id} className="md:flex md:flex-row justify-center border-b-2 my-3 items-center">
                            <div className='md:basis-1/12 font-bold text-lg'>
                                <p>{episode_number}</p>
                            </div>
                            <div className='md:basis-2/6 my-2'>
                                <img src={Img_Url+still_path} alt={name} />
                            </div>
                            <div className='md:basis-3/5 pl-3 py-5'>
                                <p className='font-semibold text-lg'>{name}</p>
                                <p className='trucate text-sm font-normal'>{overview}</p>
                            </div>
                        </div>
                    )
                })} </div>}
            </div>
        </>
    )
}

export default SeasonInfo