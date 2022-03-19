import { useEffect, useState } from 'react';
import {firebaseConfig, database} from '../../firebaseConfig'
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Header from './header';
import styles from '../../styles/Home.module.css'
import SelectedTvseries from './selectedTvseries';
import Loading from './loadingScreen';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import moment from 'moment';


const UserList = () =>{
    const [showSelected, setShowSelected] = useState(false)
    const [selectedSeriesID, setSelectedSeriesID] = useState([])
    const[myListTvseries, setMyListTvseries] = useState([])
    const [currentUser, setCurrentUser] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [myListId, setMyListId] = useState([])

    const Img_Url = "https://image.tmdb.org/t/p/w200"
    const auth = getAuth()
    const router = useRouter()

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
                //setIsLoading(false)
                setMyListId(querySnapshot.docs.map((id) =>{
                    return id.id
                }))
    
                //});
              // ...
            } else {
              // User is signed out
              // ...
            }
        });
    }, [])

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
                        <Button className='w-52' variant="contained" onClick={() => {
                            setIsLoading(true)
                            router.push('./authentication')}}>Sign in</Button></div>
                    </div>
                </div>
                
            </>
        )
    }

    // if(isLoading){
    //     return(
    //     <Loading setIsLoading={setIsLoading}/>
    //     )
    // }

    console.log(myListId)

    // for selected shows

    const closeParticularSeries =() =>{
        setShowSelected(false)
    }
    const showParticularSeries = (id) =>{
        const finalValue = myListTvseries.filter((curId) => curId.id === id)
        setSelectedSeriesID(finalValue[0].id)
        setShowSelected(true)
    }

    return(
        <>
            <div>
                <Header />
                <div className='m-2 mt-5 grid md:grid-cols-3'>
                {myListTvseries.map((series) =>{
                    const {id, name, poster_path, next_episode_to_air, status} = series
                    const airdate = (next_episode_to_air.air_date);
                    const arrAirDate = [airdate]
                    console.log(moment(arrAirDate[0]).fromNow())
                    const next_episode = (moment(arrAirDate[0]).fromNow())
                    return(
                        <div key={id} className='' onClick={()=> showParticularSeries(id)}>
                            <div className='flex flex-row items-center mb-5 '>
                                <div className='w-20 mr-2 md:w-40'>
                                    <img src={Img_Url+poster_path} alt={name}/>
                                </div>
                                <div>
                                    <h1 className='font-bold'>{name}</h1>
                                    {next_episode_to_air ? `Next Episode: ${next_episode}` : "No next date"}<br></br>
                                    <p>This is a {status}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
                </div>
                <SelectedTvseries closeParticularSeries={closeParticularSeries} showSelected={showSelected} selectedSeriesID={selectedSeriesID} />
            </div>
        </>
    )
}

export default UserList