import { useEffect, useState } from "react"
import {firebaseConfig, database} from '../../firebaseConfig'
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import Loading from "./loadingScreen";




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
    const getBillionsTvseriesPoster = async(url) =>{
        const response = await fetch(url, options)
        const data = await response.json()
        setBillionsTvseriesPoster(data.results)
        setPosterPath(data.stills[0].file_path)
    }

    
    useEffect( async()=>{
        //getBackScreen(url)
        await getBillionsTvseriesPoster(baseUrlBillions)
    }, [])
    
    // Get current logged in user
   const currentUser = auth.currentUser
   
    if(isLoading){
        return(
        <Loading setIsLoading={setIsLoading}/>
        )
    }

    const handleSubmit = async (e) =>{
        e.preventDefault()
        if(userPageValue){
            //await fetchMovie(searchUrl+`&query=`+userPageValue)
            router.push({
                pathname: './searchTvseries',
                query: {userPageValue: userPageValue, }
            })
        }
    }
    return (
        <>
            <div>
                <div className='h-screen'>
                <div style={{ backgroundImage: `url(${billionsImageUrl})`}} className='h-1/2 bg-contain bg-no-repeat md:h-2/3 bg-center md:bg-cover '>
                    <ToastContainer/>
                    <h1>welcome: {currentUser ? currentUser.email : ""}</h1>
                    <form>
                        <input type='text' placeholder='Search' value={userPageValue} onChange={(e) =>{
                            setUserPageValue(e.target.value)
                        }}/>
                        <Button onClick={(e) =>
                            handleSubmit(e)
                        }>Search</Button>
                    </form>
                    <div>
                        <button className='p-2 ba'>Sign Out</button>
                    </div>
                </div>
                </div>
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