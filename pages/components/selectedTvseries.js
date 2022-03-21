import { useState, useEffect } from "react"
import AddToList from "./addToList"
import RemoveShow from "./removeFromList"
import moment from 'moment';
import { getAuth, onAuthStateChanged} from "firebase/auth";
import SeasonInfo from './seasonInfo'



import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Loading from './loadingScreen';


const SelectedTvseries = ({closeParticularSeries, showSelected, selectedSeriesID}) =>{

    const auth = getAuth()

    const [isLoading, setIsLoading] = useState(true)
    

    const [selectedTvseriesInfo, setSelectedTvseriesInfo] = useState([])
    const [nextEpisode, setNextEpisode] = useState([])
    const [genres, setGenres] = useState([])
    const [seasons, setSeasons] = useState([])
    const [eachSeason, setEachSeason] = useState('')
    const [eachSeasonId, setEachSeasonId] = useState()
    const [season_number, setSeason_number] = useState()


    const[smallLoading, setSmallLoading] = useState(true)

    const apiKey = "?api_key=4e73e1dfa07d9055c678d3e4ad6ac341"
    const url = "https://api.themoviedb.org/3/tv/"


    var options = {
        method: 'GET',
        headers:{
        'Authorization': '4e73e1dfa07d9055c678d3e4ad6ac341',
        'Content-Type': 'application/json'
        }
    }

    const getSelectedTvseries = async(url) =>{
        try{
            const response = await fetch(url, options)
            const data = await response.json()
            setSelectedTvseriesInfo(data)
            setGenres(data.genres)
            setNextEpisode(data.next_episode_to_air)
            setSeasons(data.seasons)
            setIsLoading(false)
        }catch(err){
            setIsLoading(false)
            toast.error(err)
        }    
    }

    useEffect(() =>{
        if(showSelected === true){
            getSelectedTvseries(url+selectedSeriesID+apiKey)
        }
    }, [showSelected])

    if(!showSelected){
        return null
    }

    if(isLoading){
        return(
        <Loading setIsLoading={setIsLoading}/>
        )
    }




    const Img_Url = "https://image.tmdb.org/t/p/w300"
    const {id, name, overview, poster_path, number_of_seasons, next_episode_to_air, status} = selectedTvseriesInfo

            const airdate = nextEpisode ? [nextEpisode.air_date] : "";
    return(
        <>
            <div className='modal w-screen'>
                <div className='modal-content h-full md:w-8/12 w-11/12'>
                    <div className='modal-header flex flex-row justify-between pt-10 px-5 pb-2 bg-black text-white'>
                        <h4 className='modal-title font-bold text-3xl'> {name}</h4>
                        <button onClick={() => closeParticularSeries()} className='button font-extrabold text-xl'>X</button>
                    </div>
                    <div className='modal-body bg-black text-white'>
                        <div className="flex items-center">
                            <div className="flex justify-center md:w-64 w-40 mr-10">
                                <img src={Img_Url+poster_path} alt={name}/>
                            </div>

                            <div>{nextEpisode ? <div>{status}
                                    <p className="mb-3 font-bold">Info for Next Episode</p>
                                    <p className="mb-2">Title: {nextEpisode.name}</p>
                                    <p className="mb-2">Airing {(moment(airdate[0]).fromNow())}</p>
                                    <p className="mb-2">Episode: {nextEpisode.episode_number}</p>
                                    <p className="mb-2">Season: {nextEpisode.season_number} </p></div>: <div>{status}<br></br> No new episode release date yet</div>}  
                                    <div>
                            </div> 
                            </div>
                        </div>
                        <div>
                            <div>
                            </div>
                            <div className="mt-5 flex flex-row justify-between">
                                <div>
                                <h1>Genres</h1>
                                {genres.map((genre) =>{
                                    const {id, name} = genre;
                                    return(
                                        <div key={id}>
                                            <h1>- {name}</h1>
                                        </div>
                                    )
                                })}
                                </div>
                                
                                <div className="flex justify-between">
                                    <AddToList className='mr-3' id={id} name={name} poster_path={poster_path} nextEpisode={nextEpisode} next_episode_to_air={next_episode_to_air} status={status}/>
                                    <div className="ml-3">{auth.currentUser ? <RemoveShow id={id} name={name} /> : ""}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white md:px-14 px-10">
                        <div className="flex flex-row items-center justify-between pt-5">
                            <div>
                                <Box sx={{ minWidth: 90 }} className='w-full'>
                                    <FormControl  className='w-40'>
                                    <InputLabel key={id} id="demo-simple-select-label">Check Seasons</InputLabel>
                                    <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={eachSeason}
                                    label="Check Seasons"
                                    onChange={(e) => {
                                        setEachSeason(e.target.value)
                                        }}
                                    >
                                        {seasons.map((season) => {
                                            const {id, name, episode_count, season_number} = season
                                            return(    
                                                <MenuItem value={name} key={id} onClick={() => {
                                                    setSeason_number(season_number)
                                                    setSmallLoading(false)
                                                    setEachSeasonId(id)}} className='border-b-4'>{name} <span className="text-sm md:ml-10">({episode_count} episodes)</span></MenuItem>
                                            )
                                    })}
                                    </Select>
                                    </FormControl>
                                </Box>
                            </div>
                            <div className= 'text-2xl font-bold '>  
                                <p className="">Episodes</p>
                            </div>
                        </div>
                    
                        {smallLoading ? '' : <SeasonInfo  id={id} season_number={season_number}/>}

                        <div className="pt-5">
                            <p className="text-center font-bold mb-2">Overview</p>
                            {overview}
                        </div>
                    
                        <div className='modal-footer mb-10'>
                            <button onClick={closeParticularSeries} className='button'></button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SelectedTvseries