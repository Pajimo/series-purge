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




const UserPage = () =>{
    const [userPagedata, setUserPageData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [disable, setShowDisable] = useState(false)


    const days = [ 'Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    const auth = getAuth();
    const dayOfTheWeek = moment().day()
    const dateOfTheMonth = moment().date()
    console.log(days[dayOfTheWeek])
    console.log(dateOfTheMonth)
    console.log(new Date())
    var now = moment();
    console.log(now.format())
    console.log(moment([2022, 2, 27]).fromNow())
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
            <div>
                <Header disable={disable} setShowDisable={setShowDisable}/>
                <div>
                <button className="m-3 font-bold p-3 rounded-lg bg-slate-500 text-white">Popular Tv Shows</button>
                    <div className="w-full  mr-3 md:grid md:grid-cols-3"> 
                        {(userPagedata.map((show) =>{
                            const {id, name, poster_path, popularity, vote_average, overview} = show
                            const newImage = 'https://res.cloudinary.com/pajimo/image/upload/v1647610106/Untitled_1.png'
                            return(
                                <div key={id} onClick={()=>showParticularSeries(id)} className="p-3 items-center flex md:border-0 border-b-2 border-t-2">
                                    <div className="w-3/12 basis-3/12">
                                        <img className="w-full " src={poster_path ? Img_Url+poster_path : newImage} alt={name}/>
                                    </div>
                                    <div className="pl-3 w-9/12 basis-9/12">
                                        <p className="font-semibold text-xl">{name}</p>
                                        <div className="w-full"><p className="truncate">{overview ? overview : ""}</p></div>
                                        <p className="font-light text-sm text-right">{vote_average}</p>
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