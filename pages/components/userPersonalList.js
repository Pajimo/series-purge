import { useEffect, useState } from 'react';
import Head from 'next/head'
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
import OneSignal from 'react-onesignal';
import Script from 'next/script'
import Footer from './footer'



const UserList = () =>{
    const [showSelected, setShowSelected] = useState(false)
    const [selectedSeriesID, setSelectedSeriesID] = useState([])
    const [myListTvseries, setMyListTvseries] = useState([])
    const [currentUser, setCurrentUser] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [listDisable, setListDisable] = useState(false)

    const Img_Url = "https://image.tmdb.org/t/p/w200"
    const auth = getAuth()
    const router = useRouter()


    useEffect(() => {
        onAuthStateChanged (auth, async(user) => {
            
            if (user) {
                setIsLoading(true)
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
                setIsLoading(false)
                let externalUserId = uid; // You will supply the external user id to the OneSignal SDK

                    OneSignal.setExternalUserId(externalUserId);
                //});
              // ...
            } else {
              // User is signed out
              // ...
            }
            setIsLoading(false)
        });
        setListDisable(true)
    }, [])



    if(isLoading){ 
        return(
            <Loading setIsLoading={setIsLoading}/>
            )
    }

    if(!auth.currentUser){
        return(
            <>
            <Head>
        <title>Series Purge | User List</title>
        <meta name="description" content="Series Purge built for tvseries info" />
        <link rel="icon" href="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8588308876797973"
          crossOrigin="anonymous"></script>
      </Head>
                <Header listDisable={listDisable}/>
                <div className='font-semibold'>
                    <div className={styles.container}>
                        <div className={styles.main}><h1 className='mb-10 text-3xl'>Sign in to view list</h1>
                        <Button className='w-52' variant="contained" onClick={() => {
                            setIsLoading(true)
                            router.push('./authentication')}}>Sign in</Button></div>
                    </div>
                </div>
                <Footer />
            </>
        )
    }

    if(myListTvseries.length === 0){
        return(
            <>
            <Head>
                <title>Series Purge | User List</title>
                <meta name="description" content="Series Purge built for tvseries info" />
                <link rel="icon" href="" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8588308876797973"
                crossOrigin="anonymous"></script>
            </Head>
                <Header listDisable={listDisable}/>
                <div className='font-semibold'>
                    <div className={styles.container}>
                        <div className={styles.main}><h1 className='mb-10 text-3xl'>List is empty</h1>
                        <Button className='w-52' variant="contained" onClick={() => {
                            setIsLoading(true)
                            router.push('./searchTvseries')}}>Add to List</Button></div>
                    </div>
                </div>
                <Footer />
            </>
        )
    }

    if(isLoading){
        return(
        <Loading setIsLoading={setIsLoading}/>
        )
    }

    const refreshData = () => {
        router.replace(router.asPath);
        //etIsLoading(true)
      }

    const closeParticularSeries = () =>{
        setShowSelected(false)
        router.replace(router.asPath);
        refreshData()
        
    }
    const showParticularSeries = (id) =>{
        const finalValue = myListTvseries.filter((curId) => curId.id === id)
        setSelectedSeriesID(finalValue[0].id)
        setShowSelected(true)
    }

    return(
        <>
        <Head>
        <title>Series Purge | User List</title>
        <meta name="description" content="Series Purge built for tvseries info" />
        <link rel="icon" href="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8588308876797973"
          crossOrigin="anonymous"></script>
      </Head>
            <div>
                <Header listDisable={listDisable}/>
                <div className='m-2 mt-5 grid md:grid-cols-3'>
                {myListTvseries.map((series) =>{
                    const {id, name, poster_path, next_episode_to_air, status, nextEpisode} = series
                    const newImage = 'https://res.cloudinary.com/pajimo/image/upload/v1647610106/Untitled_1.png'
                    const airdate = nextEpisode ? [nextEpisode.air_date] : "";
                    return(
                        <div key={id} className='' onClick={()=> showParticularSeries(id)}>
                            <div className='flex flex-row items-center mb-5 '>
                                <div className='w-20 mr-2 md:w-40'>
                                    <img src={poster_path ? Img_Url+poster_path : newImage} alt={name}/>
                                </div>
                                <div>
                                    <h1 className='font-bold'>{name}</h1>
                                    {next_episode_to_air ? 
                                        <div> 
                                            <p>Next Episode on {((moment().add((moment(airdate[0]).fromNow())[2] + (moment(airdate[0]).fromNow())[3] + (moment(airdate[0]).fromNow())[4], 'days').calendar(null, {
                                            sameDay: '[Today]',
                                            nextDay: '[Tomorrow]',
                                            nextWeek: 'dddd',
                                            lastDay: '[Yesterday]',
                                            lastWeek: '[Last] dddd',
                                            sameElse: 'DD/MM/YYYY'
                                        })))}</p><p> {(moment(airdate[0]).fromNow())} </p>
                                            <p className='font-bold'>S{nextEpisode.season_number} | E{nextEpisode.episode_number}</p>
                                            <p>{nextEpisode.name}</p>
                                </div> : "Next date not available"}
                                    <p>{status}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
                </div>
                <SelectedTvseries setMyListTvseries={setMyListTvseries} myListTvseries={myListTvseries} closeParticularSeries={closeParticularSeries} showSelected={showSelected} selectedSeriesID={selectedSeriesID} />
            </div>
            <Footer />
        </>
    )
}

export default UserList