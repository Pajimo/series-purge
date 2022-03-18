import { getAuth, onAuthStateChanged} from "firebase/auth";
import {firebaseConfig, database} from '../../firebaseConfig';
import { collection, addDoc, getDocs, query, where, doc } from 'firebase/firestore';
import Loading from './loadingScreen';
import {useEffect, useState} from 'react';
import { BsPersonFill } from "react-icons/bs";
import styles from '../../styles/Home.module.css';
import Header from './header';

const Profile = () =>{

    const auth = getAuth()
    const [userProfile, setUserProfile] = useState([])
    const [userProfile2, setUserProfile2] = useState([])

    useEffect(() =>{
        onAuthStateChanged (auth, async(user) => {
            if (user) {
                const uid = user.uid;
                const q = query(collection(database, "users"), where("uid", "==", uid));
                const docs = await getDocs(q);
                // setMyListTvseries(querySnapshot.docs.map((doc) =>{
                //         return { ...doc.data()}
                // }))
                setUserProfile(docs.docs.map((doc) =>{
                    return { ...doc.data()}
                })) 
            } else {
              // User is signed out
              // ...
            }
        });
    }, [])


    return(
        <>
            <Header />
            <div className="grid">
                {userProfile.map((users) =>{
                    const {name, email, uid} = users
                    return(
                        <div key={uid} className='place-self-center '>
                            <div className="md:flex md:flex-row items-center mt-20">
                                <div className="flex justify-center mb-10 md:mb-0">
                                    <BsPersonFill size={100} className=" rounded-full bg-slate-400 text-red-400"/>
                                </div>
                                <div className="ml-5">
                                    <h1 className="text-center text-2xl">Welcome {name}</h1>
                                    <h1 className="text-center">Email: {email}</h1>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default Profile