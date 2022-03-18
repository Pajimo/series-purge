import {firebaseConfig, database} from '../../firebaseConfig'
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
//import CheckIcon from '@mui/icons-material/Check';
import { FaCheck } from "react-icons/fa";



const AddToList = ({id, next_episode_to_air, name, poster_path, status}) =>{

    const [forList, setForList] = useState([])
    const [checking, setChecking] = useState(false)
    const [success, setSuccess] = useState(false)

    const auth = getAuth()


    const apiKey = "?api_key=4e73e1dfa07d9055c678d3e4ad6ac341"
    const url = "https://api.themoviedb.org/3/tv/"


    var options = {
        method: 'GET',
        headers:{
        'Authorization': '4e73e1dfa07d9055c678d3e4ad6ac341',
        'Content-Type': 'application/json'
        }
    }


    const fetchData = async() =>{
        const response = await fetch(url, options)
        const data = await response.json()
        setForList(data)
    }

    const addTOPersonalList = () =>{       
            onAuthStateChanged(auth, async(user) => {
                if (user) {
                    setChecking(true)
                    // User is signed in, see docs for a list of available properties
                    // https://firebase.google.com/docs/reference/js/firebase.User
                    
                    const uid = user.uid ;
                    //const tvseries = collection(database, uid);
                    let newId = id.toString()
                    const tvshows = doc(database, uid, newId)
                    const checkData = await getDoc(tvshows)
                    if(checkData.exists()){
                        console.log('err')
                        toast.error(`${name} is already in your list`)
                        setChecking(false)
                    }
                    else{
                        setDoc(tvshows, {
                            name,
                            id,
                            next_episode_to_air,
                            poster_path,
                            status
                          });
                          setChecking(false)
                          setSuccess(true)
                              setTimeout(() =>{
                                  setSuccess(false)
                              }, 2000)
                        toast(`${name} added to your List`)
                    }
                    // addDoc(tvseries, {
                    //     name,
                    //     id,
                    //     next_episode_to_air,
                    //     poster_path
                    // })
                } else{
                // ...
                // User is signed out
                // ...
                    toast.error("Please Log In to add to List")
                }
            });
    }

    return(
        <>
        <ToastContainer />
            <div className='mt-3'>
                <Button variant="contained" onClick={addTOPersonalList} >
                    {checking ? <CircularProgress size= {25}/> : success ? <FaCheck /> : 'Add to list'}
                </Button>
            </div>
        </>
    )
}

export default AddToList