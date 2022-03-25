import { getAuth, onAuthStateChanged, deleteUser, signOut, EmailAuthProvider, reauthenticateWithCredential} from "firebase/auth";
import {firebaseConfig, database} from '../../firebaseConfig';
import { collection, addDoc, deleteDoc, getDocs, getDoc, query, where, doc } from 'firebase/firestore';
import Loading from './loadingScreen';
import {useEffect, useState} from 'react';
import { BsPersonFill } from "react-icons/bs";
import styles from '../../styles/Home.module.css';
import Header from './header';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from "react-toastify";
import CircularProgress from '@mui/material/CircularProgress';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head'

const Profile = () =>{

    const auth = getAuth()
    const router = useRouter()

    const [checking, setChecking] = useState(false)
    const [userId, setUserId] = useState('')
    const [userProfile, setUserProfile] = useState([])
    const [deleteClicked, setDeleteClicked] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [display_name, setDisplay_name] = useState('')
    const [password, setPassword] = useState('')
    const[myListTvseries, setMyListTvseries] = useState([])

    useEffect(() =>{
        onAuthStateChanged (auth, async(user) => {
            setIsLoading(false)
            if (user) {
                const uid = user.uid;
                setUserId(uid)
                setDisplay_name(user.displayName)

                const q = query(collection(database, "users"), where("uid", "==", uid));
                const docs = await getDocs(q);
                // setMyListTvseries(querySnapshot.docs.map((doc) =>{
                //         return { ...doc.data()}
                // }))
                setUserProfile(docs.docs.map((doc) =>{
                    return { ...doc.data()}
                }))
                const querySnapshot = await getDocs(collection(database, uid));
                // querySnapshot.forEach((doc) => {
                //   //console.log(`${doc.id} => ${doc.data()}`);
                //   console.log(doc.data())
                setMyListTvseries(querySnapshot.docs.map((doc) =>{
                        return { ...doc.data()}
                }))
            } else {
              // User is signed out
              // ...

            }
        });
    }, [])
    
    const deleteAccount = async() =>{
        if(!password){
            toast.error("Enter correct password")
        }else{
            setChecking(true)
            const credential = EmailAuthProvider.credential(
                auth.currentUser.email,
                password
            )
            const user = auth.currentUser
            reauthenticateWithCredential(user, credential).then(async () => {
                //User re-authenticated.
                // const q = query(collection(database, "users"), where("uid", "==", user.uid));
                // const docs = await getDocs(q);
                // deleteDoc(q)
                deleteUser(user).then(() => {
                    // User deleted.
                    toast(`${display_name}, your account has been deleted`)
                }).catch((error) => {
                    // An error ocurred
                    // ...
                    toast.error(error)
                });
                setChecking(false)
            }).catch((error) => {
                setChecking(false)
                console.log(error)
                // An error ocurred
                // ...
                toast.error(error)
            });
        }
    }

    if(isLoading){
        return(
        <Loading setIsLoading={setIsLoading}/>
        )
    }

    if(!auth.currentUser){
        return(
            <>
                <Header />
                <div className='font-semibold'>
                    <div className={styles.container}>
                        <div className={styles.main}><h1 className='mb-10 text-3xl'>Sign in to view list</h1>
                        <button className='w-52 p-3 rounded-lg bg-slate-500 text-white' variant="contained" onClick={() => {
                            setIsLoading(true)
                            router.push('./authentication')}}>Sign in</button></div>
                    </div>
                </div>
                
            </>
        )
    }

    if(deleteClicked){
        return(<>
            <ToastContainer />
            <div className='modal w-screen'>
                <div className='modal-content h-full md:w-8/12 w-11/12'>
                    <div className='modal-header flex items-center  px-5 bg-red-500 text-white'>
                    <div className="logo flex justify-center"></div>
                        <h4 className='modal-title font-bold text-3xl text-center'> Delete Account</h4>
                    </div>
                    <div className=' bg-black text-white px-5 py-10'>
                        <p>Are you sure you want to delete your Series Purge account?<br></br>
                        </p>
                        <p className="py-5">Sad to see you go.</p>
                        <input className="p-3 h-10 text-black" required type='password' placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                        
                        <div className='modal-footer mb-10 bg-white flex justify-center py-10'>
                            <button onClick={() => deleteAccount()} className='button p-3 mr-10 bg-red-500 text-white'>{checking ? <CircularProgress /> :'Confirm Delete'}</button>
                            <button onClick={() => setDeleteClicked(false)} className='button p-3 bg-black text-white'>Cancel Delete</button>
                        </div>
                    
                </div>
            </div>
            </>
        )
        
    }



    return(
        <>
        <Head>
        <title>Series Purge | User Profile</title>
        <meta name="description" content="Series Purge built for tvseries info" />
        <link rel="icon" href="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async=""></script>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8588308876797973"
          crossorigin="anonymous"></script>
      </Head>
            <Header />
            <div className='flex justify-center'>
                <h1 className="logo"></h1>
            </div>
            <div className="pt-5 font-bold text-center text-3xl">Your Profile</div>
            <h1 className="pt-2 font-bold text-center text-2xl">Welcome: {display_name}</h1>
            <div className="grid pb-20">
                {userProfile.map((users) =>{
                    const {name, email, uid, firstName} = users
                    return(
                        <div key={uid} className='place-self-center '>
                            <div className="md:flex md:flex-row items-center mt-20">
                                <div className="flex justify-center mb-10 md:mb-0">
                                    <BsPersonFill size={100} className=" rounded-full bg-slate-400 text-red-400"/>
                                </div>
                                <div className="ml-5">
                                    <h1 className="font-semibold text-lg">Full name: {name}</h1>
                                    <h1 className="font-semibold">Email: {email}</h1>
                                </div>
                            </div>
                        </div>
                    )
                })}
                <div className='p-3 text-xl font-semibold mt-10'>
                    <p>Number of shows in list: {myListTvseries.length}</p>
                </div>
                <div className="pt-20 flex justify-center">
                    <button className="p-3 bg-red-500 text-white font-bold" onClick={() => setDeleteClicked(true)}>Delete Account</button>
                </div>

            </div>
        </>
    )
}

export default Profile