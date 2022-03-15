import { useState, useEffect } from "react"


const SelectedTvseries = ({closeParticularSeries, showSelected, selectedSeriesID, setShowSelected}) =>{

    const [selectedTvseriesInfo, setSelectedTvseriesInfo] = useState([])
    const [nextEpisode, setNextEpisode] = useState([])

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
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    setSelectedTvseriesInfo(data)
    setNextEpisode(data.next_episode_to_air)

    }

    useEffect(() =>{
        if(showSelected === true){
            getSelectedTvseries(url+selectedSeriesID+apiKey)
        }
    }, [showSelected])


    if(!showSelected){
        return null
    }
    const Img_Url = "https://image.tmdb.org/t/p/w300"
    const {name, overview, poster_path, number_of_seasons, next_episode_to_air} = selectedTvseriesInfo
    return(
        <>
        
            <div className='modal'>
                <div className='modal-content'>
                    <div className='modal-header flex flex-row justify-between mt-20 mx-5'>
                        <h4 className='modal-title'>Title: {name}</h4>
                        <button onClick={closeParticularSeries} className='button font-bold'>X</button>
                    </div>
                    <div className='modal-body'>
                        <div className="flex justify-center ">
                            <img src={Img_Url+poster_path} alt={name}/>
                        </div>
                        <div>
                            <div>
                                <div>{nextEpisode ? <div><p>Info for Next Episode</p>
                                    <p>Title: {nextEpisode.name}</p>
                                    <p>Air date: {nextEpisode.air_date}</p>
                                    <p>Episode: {nextEpisode.episode_number}</p>
                                    <p>Season: {nextEpisode.season_number}</p></div>: "" }   
                                </div>
                            </div>
                            <div>
                                <p className="text-center">Overview</p>
                                {overview}
                            </div>
                            
                        </div>
                        
                    </div>
                    <div className='modal-footer'>
                        <button onClick={closeParticularSeries} className='button'>Close</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SelectedTvseries