import { useState, useEffect } from "react"
import AddToList from "./addToList"
import RemoveShow from "./removeFromList"


const SelectedTvseries = ({closeParticularSeries, showSelected, selectedSeriesID}) =>{

    const [selectedTvseriesInfo, setSelectedTvseriesInfo] = useState([])
    const [nextEpisode, setNextEpisode] = useState([])
    const [genres, setGenres] = useState([])

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
    setGenres(data.genres)
    console.log(data.genres)
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
    const {id, name, overview, poster_path, number_of_seasons, next_episode_to_air} = selectedTvseriesInfo
    return(
        <>
        
            <div className='modal rounded-xl'>
                <div className='modal-content'>
                    <div className='modal-header flex flex-row justify-between mt-10 mx-5 mb-2'>
                        <h4 className='modal-title font-bold'>Title: {name}</h4>
                        <button onClick={closeParticularSeries} className='button font-extrabold text-xl'>X</button>
                    </div>
                    <div className='modal-body'>
                        <div className="flex items-center">
                            <div className="flex justify-center w-40 mr-10">
                                <img src={Img_Url+poster_path} alt={name}/>
                            </div>
                            <div>{nextEpisode ? <div><p className="mb-3 font-bold">Info for Next Episode</p>
                                    <p className="mb-2">Title: {nextEpisode.name}</p>
                                    <p className="mb-2">Air date: {nextEpisode.air_date}</p>
                                    <p className="mb-2">Episode: {nextEpisode.episode_number}</p>
                                    <p className="mb-2">Season: {nextEpisode.season_number}</p></div>: "" }  
                                    <div>
                                <AddToList id={id} name={name} poster_path={poster_path} next_episode_to_air={next_episode_to_air}/>
                                <RemoveShow id={id} name={name} />
                            </div> 
                            </div>
                        </div>
                        <div>
                            <div>
                            </div>
                            <div className="mt-5">
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
                            <div>
                                <p className="text-center font-bold mb-2">Overview</p>
                                {overview}
                            </div>
                            
                        </div>
                        
                    </div>
                    <div className='modal-footer mb-10'>
                        <button onClick={closeParticularSeries} className='button'></button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SelectedTvseries