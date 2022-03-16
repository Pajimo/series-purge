import ImageList from '@mui/material/ImageList';
import { useEffect, useState } from 'react';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {firebaseConfig, database} from '../../firebaseConfig'
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { useRouter } from "next/router";
import { Button } from "@mui/material";
import Loading from './loadingScreen';
import SelectedTvseries from './selectedTvseries';
import Header from './header';


const SearchMovie = () =>{

    const [searchdata, setSearchData] = useState([])
    const [currentUser, setCurrentUser] = useState('')
    const [searchValue, setSearchValue]= useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [selectedSeriesID, setSelectedSeriesID] = useState([])
    const [showSelected, setShowSelected] = useState(false)
    const auth = getAuth();
    
    const router = useRouter()
    const { query: { userPageValue }} = router

    const Img_Url = "https://image.tmdb.org/t/p/w500"

    const apiKey = 'api_key=4e73e1dfa07d9055c678d3e4ad6ac341'

    const baseUrl = `https://api.themoviedb.org/3`
    
    const searchUrl = baseUrl+'/search/tv?'+apiKey


    useEffect(() =>{
        setCurrentUser(auth.currentUser)
    }, [])


    const signedOut = () =>{
        if(currentUser){
            signOut(auth).then(() => {
                toast("Sign-out successful")
                setCurrentUser('')
            }).catch((error) => {
                // An error happened.
                console.log(error)
            });
        }else{
            router.push('./authentication')
        }
    }

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

    const handleSubmit = (e) =>{
        e.preventDefault()
        if(searchValue){
            setIsLoading(true)
            fetchMovie(searchUrl+`&query=`+searchValue)
            setIsLoading(false)
            toast("Search Successful")
        }
        else{
            toast.error('Enter name of a Tvseries')
        }
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

    return (
        <>
        <ToastContainer/>
            <div>
                
               <Header />
                <div className='flex flex-row flex-wrap mx-2 md:mx-5 mt-10'>
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
                <SelectedTvseries closeParticularSeries={closeParticularSeries} showSelected={showSelected} selectedSeriesID={selectedSeriesID} setShowSelected={setShowSelected}/>
            </div>
        </>
    )
}

export default SearchMovie