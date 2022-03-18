import { useEffect, useState } from "react"
import {firebaseConfig, database} from '../../firebaseConfig'
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import Loading from "./loadingScreen";
import SelectedTvseries from './selectedTvseries';
import Header from "./header";




const UserPage = () =>{
    const [userPagedata, setUserPageData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const auth = getAuth();
    const router = useRouter()

    const Img_Url = "https://image.tmdb.org/t/p/original"
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

      const redirect = () =>{
          router.push('./authentication')
      }

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
        setIsLoading(false)
        const response = await fetch(baseUrl, options)
        const data = await response.json()
        setUserPageData(data.results)

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
            <div>
                <Header />
                <div>
                <button className="m-3 font-bold p-3 rounded-lg bg-black text-white">Popular Tv Shows</button>
                    <div className="w-full  mr-3 md:grid md:grid-cols-3"> 
                        {(userPagedata.map((show) =>{
                            const {id, name, poster_path, popularity, vote_average, overview} = show
                            return(
                                <div key={id} onClick={()=>showParticularSeries(id)} className="m-3 items-center flex">
                                    <div>
                                        <img className="w-20 md:w-52" src={Img_Url+poster_path} alt={name}/>
                                    </div>
                                    <div className="ml-3 w-9/12">
                                        <p className="font-semibold text-xl">{name}</p>
                                        <p className="truncate ">{overview}</p>
                                        <p className="font-light text-sm">Ratings: {vote_average}</p>
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