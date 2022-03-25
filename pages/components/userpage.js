import { useEffect, useState } from "react"
import {firebaseConfig, database} from '../../firebaseConfig'
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import Loading from "./loadingScreen";
import SelectedTvseries from './selectedTvseries';
import Header from "./header";
import moment from 'moment';
import Head from 'next/head'
import { BiDotsVertical } from "react-icons/bi";



const UserPage = () =>{
    const [userPagedata, setUserPageData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [disable, setShowDisable] = useState(false)

    const auth = getAuth();

    const router = useRouter()

    const Img_Url = "https://image.tmdb.org/t/p/w200"
    const baseUrl = "https://api.themoviedb.org/3/tv/popular?api_key=4e73e1dfa07d9055c678d3e4ad6ac341"


    onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          const uid = user.uid;
          // ...
        } else {
          // User is signed out
          // ...
        }
      });

    var options = {
        method: 'GET',
        headers:{
        'Authorization': '4e73e1dfa07d9055c678d3e4ad6ac341',
        'Content-Type': 'application/json'
        }
    }

    // const getBackScreen = async(url) =>{
    //     const response = await fetch(url, options)
    //     const data = await response.json()
    //     setBackScreen(data.result)

    // }


    useEffect(async() =>{
        try{
            setIsLoading(true)
            const response = await fetch(baseUrl, options)
            const data = await response.json()
            setUserPageData(data.results)
            setIsLoading(false)
            setShowDisable(true)
        }catch(err){
            setIsLoading(false)
            toast.error(err)
        }
    }, [])


// for selected shows
const [showSelected, setShowSelected] = useState(false)
const [selectedSeriesID, setSelectedSeriesID] = useState([])
   const closeParticularSeries =() =>{
    setShowSelected(false)
}
const showParticularSeries = (id) =>{
    const finalValue = userPagedata.filter((curId) => curId.id === id)
    setSelectedSeriesID(finalValue[0].id)
    setShowSelected(true)
}

    if(isLoading){
        return(
        <Loading setIsLoading={setIsLoading}/>
        )
    }

    return (
        <>
        <Head>
        <title>Series Purge | Main Page</title>
        <meta name="description" content="Series Purge built for tvseries info" />
        <link rel="icon" href="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async=""></script>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8588308876797973"
          crossOrigin="anonymous"></script>
      </Head>
      <ToastContainer />
            <div>
                <Header disable={disable} setShowDisable={setShowDisable}/>
                <div>
                <button className="m-3 font-bold p-3 rounded-lg bg-slate-500 text-white">Popular Tv Shows</button>
                    <div className="w-full  mr-3 md:grid md:grid-cols-3"> 
                        {(userPagedata.map((show) =>{
                            const {id, name, poster_path, popularity, vote_average, overview} = show
                            const newImage = 'https://res.cloudinary.com/pajimo/image/upload/v1647610106/Untitled_1.png'
                            return(
                                <div key={id} className="relative p-3 items-center flex justify-between md:border-0 border-b-2 border-t-2">
                                    <div className="flex" onClick={()=>showParticularSeries(id)}>
                                        <div className="w-3/12 basis-3/12">
                                            <img className="w-full " src={poster_path ? Img_Url+poster_path : newImage} alt={name}/>
                                        </div>
                                        <div className="pl-3 w-9/12 basis-9/12">
                                            <p className="font-semibold text-xl">{name}</p>
                                            <p className="font-light text-sm">{vote_average}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        }))}
                    </div>
                    <div>

                    </div>
                </div>
                <SelectedTvseries closeParticularSeries={closeParticularSeries} showSelected={showSelected} selectedSeriesID={selectedSeriesID} />
            </div>
        </>
    )
}

export default UserPage