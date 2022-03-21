import {firebaseConfig, database} from '../../firebaseConfig'
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { FaCheck } from "react-icons/fa";


const RemoveShow =({id, name}) =>{

    const [myListId, setMyListId] = useState([])
    const [checking, setChecking] = useState(false)
    const [success, setSuccess] = useState(false)

    const auth = getAuth()


    const removeFromList = () =>{       
        onAuthStateChanged(auth, async(user) => {
            if (user) {
                setChecking(true)
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                
                const uid = user.uid;
                //const tvseries = collection(database, uid);
                // addDoc(tvseries, {
                //     name,
                //     id,
                //     next_episode_to_air,
                //     poster_path
                // })
                //toast(`${name} added to your List`)

                // changed the show id to string, the firebase command wants it to be a str
                let newId = id.toString()
                // created the database. but wont recreate
                const tvshows = doc(database, uid, newId)
                //getting the database in this page
                const checkData = await getDoc(tvshows)
                // if it exists, delete if not tell the user it doesnt exist in their list
                if(checkData.exists()){
                    await deleteDoc(tvshows)
                    setChecking(false)
                          setSuccess(true)
                              setTimeout(() =>{
                                  setSuccess(false)
                              }, 2000)
                    toast(`${name} deleted from your list`)
                }
                else{
                    toast(`${name} is not in your List`)
                    setChecking(false)
                }
            // ...
            } else {
            // User is signed out
            // ...
            toast.error("Log in to remove from list")
            }
        });
}


    return(
        <>
            <div>
                <div className='mt-3'>
                    <button onClick={removeFromList} className='p-2 bg-slate-500 rounded-xl border-2'>
                        {checking ? <CircularProgress size= {25}/> : success ? <FaCheck /> : 'Remove'}
                    </button>
                </div>
            </div>
        </>
    )

}

export default RemoveShow