import { useEffect, useState } from 'react';
import {firebaseConfig, database} from '../../firebaseConfig'
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Header from './header';


const UserList = () =>{

    const[myListTvseries, setMyListTvseries] = useState([])
    const [currentUser, setCurrentUser] = useState('')
    const Img_Url = "https://image.tmdb.org/t/p/w200"
    const auth = getAuth()
    useEffect(() => {
        onAuthStateChanged (auth, async(user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                setCurrentUser(user.email)
                const uid = user.uid;
                const querySnapshot = await getDocs(collection(database, uid));
                // querySnapshot.forEach((doc) => {
                //   //console.log(`${doc.id} => ${doc.data()}`);
                //   console.log(doc.data())
                setMyListTvseries(querySnapshot.docs.map((doc) =>{
                        return { ...doc.data()}
                }))
    
                //});
              // ...
            } else {
              // User is signed out
              // ...
            }
        });
    }, [])



    return(
        <>
            <div>
                <Header />
                <div className='m-2'>
                {myListTvseries.map((series) =>{
                    const {id, name, poster_path, next_episode_to_air} = series
                    return(
                        <div key={id} className=''>
                            <div className='flex flex-row'>
                                <div className='w-20 mr-2'>
                                    <img src={Img_Url+poster_path} alt={name}/>
                                </div>
                                <div>
                                    <h1 className='font-bold'>{name}</h1>
                                    {next_episode_to_air ? `Next Episode: ${next_episode_to_air.air_date}` : " "}
                                </div>
                            </div>
                        </div>
                    )
                })}
                </div>
                
            </div>
        </>
    )
}

export default UserList