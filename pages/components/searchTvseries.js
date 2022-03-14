import ImageList from '@mui/material/ImageList';
import { useEffect, useState } from 'react';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { ToastContainer, toast } from "react-toastify";
import {firebaseConfig, database} from '../../firebaseConfig'
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { Button } from "@mui/material";
import Loading from './loadingScreen';


const SearchMovie = () =>{

    const [searchdata, setSearchData] = useState([])
    const [currentUser, setCurrentUser] = useState('')
    const [searchValue, setSearchValue]= useState('')
    const [isLoading, setIsLoading] = useState(false)
    const auth = getAuth();
    const router = useRouter()
    const { query: { userPageValue }} = router

    const Img_Url = "https://image.tmdb.org/t/p/w500"

    const apiKey = 'api_key=4e73e1dfa07d9055c678d3e4ad6ac341'

    const baseUrl = `https://api.themoviedb.org/3`
    
    const searchUrl = baseUrl+'/search/tv?'+apiKey


    onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          setCurrentUser(auth.currentUser)
          const uid = user.uid;
          // ...
        } else {
          // User is signed out
          // ...
        }
    });

    const signedOut = () =>{
        signOut(auth).then(() => {
            toast("Sign-out successful")
            setSignedInUser("")
        }).catch((error) => {
            // An error happened.
            console.log(error)
        });
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
        console.log(data)
        console.log(data.result)
    }

    const handleSubmit = (e) =>{
        e.preventDefault()
        setIsLoading(true)
        fetchMovie(searchUrl+`&query=`+searchValue)
        setIsLoading(false)
    }

    useEffect(async () =>{
        setIsLoading(true)
        await fetchMovie(searchUrl+`&query=`+userPageValue)
        setIsLoading(false)
    }, [userPageValue])

    if(isLoading){
        return(
        <Loading setIsLoading={setIsLoading}/>
        )
    }

    return (
        <>
            <div>
                <ToastContainer/>
                <h1>welcome: {currentUser ? currentUser.email : ""}</h1>
                <form>
                    <input type='text' placeholder='Search' value={searchValue} onChange={(e) =>{
                        setSearchValue(e.target.value)
                    }}/>
                    <Button onClick={(e) =>
                        handleSubmit(e)
                    }>Search</Button>
                </form>
                <Button variant="contained" onClick={() =>{
                    signedOut()}}>{currentUser ? "Sign Out" : "Sign In"}</Button>
                <div className='flex flex-col justify-center md:grid md:grid-cols-3'>{searchdata.map((data) =>{
                    const {id, name, poster_path, overview} = data;
                    return(
                        <div key={id}>
                            <p>{name}</p>
                            <ImageList sx={{ width: 500, height: 450 }}>
                                <ImageListItem className='w-52'>
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
                })}</div>
            </div>
        </>
    )
}

export default SearchMovie