import { useEffect, useState } from "react"
import {firebaseConfig, database} from '../../firebaseConfig'
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import Loading from "./loadingScreen";
import Header from "./header";




const UserPage = () =>{
    const [signedInUser, setSignedInUser] = useState('')
    const [userPageValue, setUserPageValue] = useState('')
    const [userPagedata, setUserPageData] = useState([])
    const [userPagedata2, setUserPagedata2] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [billionsTvseriesPoster, setBillionsTvseriesPoster] = useState([])
    const [backScreen, setBackScreen] = useState([])
    const [posterPath, setPosterPath] = useState("")

    const auth = getAuth();
    const router = useRouter()

    const Img_Url = "https://image.tmdb.org/t/p/original"
    const baseUrl = "https://api.themoviedb.org/3/tv/popular?api_key=4e73e1dfa07d9055c678d3e4ad6ac341"
    const billionsImageUrl =  Img_Url+posterPath
    const baseUrlBillions = 'https://api.themoviedb.org/3/tv/62852/season/6/episode/8/images?api_key=4e73e1dfa07d9055c678d3e4ad6ac341'


    onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          setSignedInUser(user.email)
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

    // const getBackScreen = async(url) =>{
    //     const response = await fetch(url, options)
    //     const data = await response.json()
    //     setBackScreen(data.result)

    // }


    useEffect(async() =>{
        const response = await fetch(baseUrl, options)
        const data = await response.json()
        console.log(data)
        setUserPageData(data)

    }, [])

    
    // Get current logged in user
   const currentUser = auth.currentUser
   
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
                    <div>

                    </div>
                    <div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default UserPage