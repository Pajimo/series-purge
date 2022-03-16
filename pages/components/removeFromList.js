import {firebaseConfig, database} from '../../firebaseConfig'
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, doc, deleteDoc } from 'firebase/firestore';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const RemoveShow =() =>{

    const auth = getAuth()


    const removeFromList = () =>{       
        onAuthStateChanged(auth, (user) => {
            if (user) {
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
            <div>
                <div className='mt-3'>
                    <Button variant="contained" onClick={removeFromList}>
                        Remove
                    </Button>
                </div>
            </div>
        </>
    )

}

export default RemoveShow