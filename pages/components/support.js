import Footer from './footer'
import { useState } from 'react'
import Header from './header'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {firebaseConfig, database} from '../../firebaseConfig'
import CircularProgress from '@mui/material/CircularProgress';
import { collection, addDoc, getDocs, query, where, doc, setDoc } from 'firebase/firestore';


const Support = () =>{

    const [supportFirstName, setSupportFirstName] = useState('')
    const [supportEmail, setSupportEmail] = useState('')
    const [supportMessage, setSupportMessage] = useState('')
    const [checking, setChecking] = useState(false)


    const sendSuppotMessage = async(e) =>{
        e.preventDefault()
        let alldate = new Date(Date.now())
        let time = alldate.getTime()
        let day1 = alldate.getDay()
        let day2 = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        let day = day2[day1]
        let date = alldate.getDate()
        let month1 = alldate.getMonth()
        let month2 = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        let month = month2[month1]
        let year = alldate.getFullYear()
        if(!supportFirstName){
            toast.error('Enter Name')
        }else if(!supportEmail){
            toast.error('Enter Email')
        }else if(!supportMessage){
            toast.error('Enter Message')
        }else{
            try{
                setChecking(true)
                  await addDoc(collection(database, "user-support"), {
                    supportFirstName,
                    supportEmail,
                    supportMessage,
                    time,
                    day1,
                    day,
                    date,
                    month,
                    year
                  });
    
                setChecking(false)
                toast("Message Sent Succesfully")
            }catch(err){
                toast.error(err)
            }
        }
    }
    return(
        <>
        <Header />
            <div className='mx-10 pb-20'>
                <div className='flex justify-center'>
                    <h1 className="logo"></h1>
                </div>
                <div>
                    <h1 className='text-center font-bold text-3xl'>Contact The Series Purge Team</h1>
                    <p className='text-center mt-10'>Fill the contact form below for enquires and issues concerning your account or activities on Series Purge</p>
                </div>
                <div className='flex justify-center pt-14'>
                <form className='flex flex-col w-96' onSubmit={(e) => sendSuppotMessage(e)}>
                    <input className='h-10 p-2 my-3 border-2 border-gray-400' type='text' placeholder='Name' value={supportFirstName} onChange={(e)=> setSupportFirstName(e.target.value)}/>
                    <input className='h-10 p-2 my-3  border-2 border-gray-400' required type='email' placeholder='Email Address' value={supportEmail} onChange={(e)=> setSupportEmail(e.target.value)}
                    />
                    <textarea className=' p-2 my-3  border-2 border-gray-400' rows='4' placeholder='Message' value={supportMessage} onChange={(e) => setSupportMessage(e.target.value)}></textarea>
                    <div className="text-white py-2 "><button className=" p-3 bg-slate-500 w-full  rounded-xl" onSubmit={(e) => sendSuppotMessage(e)}>{checking ? <CircularProgress /> : 'Send Message'}</button></div>
                </form>
                </div>
                
            </div>
            <Footer />
        </>
    )
}

export default Support 