import Footer from './footer'
import Header from './header';
import { collection, addDoc, getDocs, query } from 'firebase/firestore';
import {firebaseConfig, database} from '../../firebaseConfig'
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useState, useEffect } from 'react';
import Loading from './loadingScreen';
import { useRouter } from 'next/router';


const Admin = () =>{

    const [supportMessage, setSupportMessage] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const auth = getAuth()
    const router = useRouter()
    useEffect( async() => {
        onAuthStateChanged (auth, async(user) => {
            if (user.uid === 'WUhtIW1NVgWMBmhO2vbBw14z7QP2') {
                const q = query(collection(database, "user-support"));
                const querySnapshot = await getDocs(q);
                setSupportMessage(querySnapshot.docs.map((doc) =>{
                return { ...doc.data()}
            }))

            setIsLoading(false)
                
            } else {
                setIsLoading(false)
                router.push('./userpage')
            }
        });
    }, [])


    if(isLoading){ 
        return(
            <Loading setIsLoading={setIsLoading}/>
            )
    }


    return(
        <>
        <Header />
        
        <div className='py-20'>
            <h1 className='text-3xl font-bold text-center mb-10'>Welcome MightyMide</h1>
            <table className="table-auto mx-20 border-separate border border-slate-400 overflow-x-scroll">
                <thead className='h-20 text-lg bg-gray-500'>
                <tr className=''>
                    <th className='border border-slate-300'>Date</th>
                    <th className='border border-slate-300'>Name</th>
                    <th className='border border-slate-300'>Email</th>
                    <th className='border border-slate-300'>Message</th>
                </tr>
                </thead>
                {supportMessage.map((support) => {
                    const {supportFirstName,
                        supportEmail,
                        supportMessage,
                        time,
                        day,
                        date,
                        month,
                        year} = support

                        return(

                            <tbody key={time}>
                                <tr>
                                <td className='border border-slate-300 p-3'>{date + ' ' + day + " " + month + " " + year}</td>
                                <td className='border border-slate-300 p-3'>{supportFirstName}</td>
                                <td className='border border-slate-300 p-3'>{supportEmail}</td>
                                <td className='border border-slate-300 p-3'>{supportMessage}</td>
                                </tr>
                            </tbody>
                        )
                })}
            </table>

            
        </div>
        <Footer />
        </>
    )
}

export default Admin