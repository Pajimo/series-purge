import ImageList from '@mui/material/ImageList';
import { useEffect, useState } from 'react';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {firebaseConfig, database} from '../../firebaseConfig'
import { getAuth, onAuthStateChanged} from "firebase/auth";
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { useRouter } from "next/router";
import { Button } from "@mui/material";
import Loading from './loadingScreen';
import SelectedTvseries from './selectedTvseries';
import Header from './header';


const SearchMovie = () =>{

    const [searchdata, setSearchData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [selectedSeriesID, setSelectedSeriesID] = useState([])
    const [showSelected, setShowSelected] = useState(false)
    const [genreId, setGenreId] = useState()
    const auth = getAuth();
    
    const router = useRouter()
    const { query: { userPageValue }} = router

    const Img_Url = "https://image.tmdb.org/t/p/w500"
    const apiKey = 'api_key=4e73e1dfa07d9055c678d3e4ad6ac341'
    const baseUrl = `https://api.themoviedb.org/3`
    const searchUrl = baseUrl+'/search/tv?'+apiKey
    const seriesOnAir = baseUrl + '/tv/on_the_air?' + apiKey
    const discoverByGenre = baseUrl + "/tv/" + genreId + "?" + apiKey
    const latestShow = baseUrl + '/tv/latest?' + apiKey;
    const airingToday = baseUrl + '/tv/airing_today?' + apiKey
    const topRated = baseUrl + '/tv/top_rated?' + apiKey;
    const popular = baseUrl + '/tv/popular?' + apiKey;



    var options = {
        method: 'GET',
        headers:{
        'Authorization': '4e73e1dfa07d9055c678d3e4ad6ac341',
        'Content-Type': 'application/json'
        }
    }

    const fetchMovie = async(url) =>{
        setIsLoading(true)
        const response = await fetch(url, options)
        const data = await response.json()
        setIsLoading(false)
        setSearchData(data.results)
    }

    useEffect(async () =>{
        setIsLoading(true)
        await fetchMovie(searchUrl+`&query=`+userPageValue)
        setIsLoading(false)
    }, [userPageValue])


    const showParticularSeries = (id) =>{
        const finalValue = searchdata.filter((curId) => curId.id === id)
        setSelectedSeriesID(finalValue[0].id)
        setShowSelected(true)
    }


    const closeParticularSeries =() =>{
        setShowSelected(false)
    }
 
    if(isLoading){
        return(
        <Loading setIsLoading={setIsLoading}/>
        )
    }


    if(searchdata.length === 0){
        return(
            <>
                <ToastContainer/>
                <div>
                    <Header />
                    <div className='text-white'>
                    <div className="flex justify-center">
                        <div className="logo"></div>
                    </div>
                         <div>
                            <p className='pb-5 mb-5 mx-5 font-bold border-b-4 text-xl text-black '>Discover Tv-Shows</p>
                        </div>
                        <div className='grid md:grid-cols-3 grid-cols-2 place-items-center border-b-4 mb-5'>
                            <div>
                                <button className='bg-zinc-500 font-semibold text-lg border-2 m-5 w-40 md:w-52 py-3 rounded-2xl text-white' onClick={() => fetchMovie(seriesOnAir)}>Currently airing</button>
                            </div>
                            <div><button className='bg-zinc-500 w-40 md:w-52 font-semibold text-lg border-2 m-5 py-3 rounded-2xl text-white' onClick={() => fetchMovie(latestShow)}>Latest Shows</button></div>
                            <div><button className='bg-zinc-500 w-40 md:w-52 font-semibold text-lg border-2 m-5 py-3 rounded-2xl ' onClick={() => fetchMovie(topRated)}>Top Rated shows</button></div>
                            <div><button className='bg-zinc-500 w-40 md:w-52 font-semibold text-lg border-2 m-5 py-3 rounded-2xl ' onClick={() => fetchMovie(airingToday)}>Airing Today</button></div>
                            <div><button className='bg-zinc-500 w-40 md:w-52 font-semibold text-lg border-2 m-5 py-3 rounded-2xl ' onClick={() => fetchMovie(popular)}>Popular</button></div>
                        </div>
                    </div>
                </div>
            </>
        )
    }


    // Weird trick to cause a re-render, no serious use #ignore
    const goBack = () =>{
        setSearchData([])
    }

    return (
        <>
        <ToastContainer/>
            <div>
                
               <Header />
               <button onClick={() =>goBack()} className='rounded-2xl bg-black text-white p-3 m-3'>
                   Back
               </button>
                <div className='flex flex-row flex-wrap mx-2 md:mx-5 mt-5'>
                    {searchdata.map((data) =>{
                    const {id, name, poster_path, overview} = data;
                    return(
                        <div key={id} className="basis-1/2 md:basis-2/6 md:mb-10 mb-5" onClick={() =>showParticularSeries(id)}>
                            <ImageList sx={{  height: 450 }} className="flex justify-center">
                                <ImageListItem className='w-48 md:w-64' style={{cursor: 'pointer'}}>
                                    <img
                                        src={poster_path ? Img_Url+poster_path : "https://images.assetsdelivery.com/compings_v2/yehorlisnyi/yehorlisnyi2104/yehorlisnyi210400016.jpg"}
                                        alt={name}
                                        loading="lazy"
                                />
                                <ImageListItemBar
                                    title={name}
                                    subtitle={<span> {overview}</span>}
                                    position="below"
                                />
                                </ImageListItem>
                            </ImageList>  
                        </div>
                    )
                    
                })}
                </div>
                <SelectedTvseries closeParticularSeries={closeParticularSeries} showSelected={showSelected} selectedSeriesID={selectedSeriesID} />
            </div>
        </>
    )
}

export default SearchMovie