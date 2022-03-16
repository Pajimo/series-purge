import {firebaseConfig, database} from '../../firebaseConfig'
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import Button from '@mui/material/Button';



const AddToList = ({id, next_episode_to_air, name, poster_path}) =>{

    const [forList, setForList] = useState([])
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
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    // User is signed in, see docs for a list of available properties
                    // https://firebase.google.com/docs/reference/js/firebase.User
                    
                    const uid = user.uid;
                    const tvseries = collection(database, uid);
                    addDoc(tvseries, {
                        name,
                        id,
                        next_episode_to_air,
                        poster_path
                    })
                    toast(`${name} added to your List`)
                // ...
                } else {
                // User is signed out
                // ...
                toast.error("Please Log In to add to List")
                }
            });
    }

    return(
        <>
            <div className='mt-3'>
                <Button variant="contained" onClick={addTOPersonalList}>
                    Add to list
                </Button>
            </div>
        </>
    )
}

export default AddToList