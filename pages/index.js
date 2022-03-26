import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {firebaseConfig, database, messageing} from '../firebaseConfig'
import { collection, addDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import Loading from './components/loadingScreen'
import OneSignal from 'react-onesignal';

export default function Home() {

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

    const handleClick = () =>{
      setIsLoading(true)
          //await fetchMovie(searchUrl+`&query=`+userPageValue)
      router.push({
          pathname: './components/userpage',
      })
    }

    if(isLoading){
      return(
          <Loading setIsLoading={setIsLoading}/>
        )
  }
  return (
    <div className='bg-cover gradient-bg-welcome text-white'>
    <div className={styles.container}>
      <Head>
        <title>Series Purge</title>
        <meta name="description" content="Series Purge built for tvseries info" />
        <link rel="icon" href="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async=""></script>
      </Head>

      <main className={styles.main}>
        <h1 className="text-4xl font-bold mb-5">Series Purge</h1>
        <p className='mb-5 font-bold text-center'>Sort out Tvseries of your choice by choosing from over a million different Tvseries </p>
        <Button variant="contained" onClick={handleClick}>
            Browse TV-Series
        </Button>
      </main>
    </div>
    </div>
  )
}
