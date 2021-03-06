import { getAuth, signOut } from "firebase/auth";
import {  useState } from "react";
import {firebaseConfig, database} from '../../firebaseConfig';
import { Button } from "@mui/material";
import { useRouter } from 'next/router';
import { BsPersonFill } from "react-icons/bs";
import { AiOutlineZoomIn } from "react-icons/ai";
import Link from 'next/link';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Loading from "./loadingScreen";
import { ToastContainer, toast } from 'react-toastify';



const Header = ({disable, discoverDisable, listDisable}) =>{
    const [userPageValue, setUserPageValue] = useState('')
    const [isLoading, setIsLoading] = useState('')

    const auth = getAuth()
    const router = useRouter()
    const currentUser = auth.currentUser


    const handleSubmit = async (e) =>{
        setIsLoading(true)
        e.preventDefault()
        if(userPageValue){
            //await fetchMovie(searchUrl+`&query=`+userPageValue)
            router.push({
                pathname: './searchTvseries',
                query: {userPageValue: userPageValue, }
            })
        }
    }

    const authSubmit = () =>{
        if(currentUser){
            setIsLoading(true)
            signOut(auth).then(() => {
                setIsLoading(false)
                toast("Sign-out successful")
            }).catch((error) => {
                // An error happened.
                toast.error('Error Signing out')
            });
        }else{
            setIsLoading(true)
            router.push('./authentication')
        }
    }
// popper code for modal
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const goToProfile = () =>{
        if(auth.currentUser){
            setIsLoading(true)
            router.push('./profile')
        }else{
            toast.error('LogIn to access your profile page')
            setTimeout(() =>{
                router.push('./authentication')
            }, 2000)

        }
    }


    if(isLoading){
        return(
            <Loading setIsLoading={setIsLoading}/>
          )
    }
    return(
        <>
        <ToastContainer />
            <div>
                <div className=' bg-black text-white'>
                    <div className='flex flex-row justify-between items-center mx-5'>
                        <div className="py-4">
                            <form className=" flex flex-row" onSubmit={(e) => handleSubmit(e)}>
                                <input type='text'  placeholder="Search Tv shows" value={userPageValue} className='w-60 h-9 rounded-xl p-3 text-black' onChange={(e) =>{
                                    e.preventDefault()
                                    setUserPageValue(e.target.value)
                                }}/>
                            </form>
                        </div>
                        <div className="flex flex-row justify-evenly py-4">
                        <button onClick={handleClick} className='rounded-xl shadow-2xl shadow-black bg-slate-600 px-4 py-2 text-center'>
                            <p><BsPersonFill size={25} className="flex justify-center"/></p>
                        </button>
                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                            
                            }}
                        ><Typography sx={{ p: 2 }} className="py-5 px-5 bg-gray-900 text-white">
                            <div>{currentUser ? `Welcome: ${currentUser.email}` : " "}</div>
                        <br></br>
                            <div className="border-b-2 py-2"><button className=" p-3 bg-slate-500  rounded-xl w-full"  onClick={() => router.push('./userPersonalList')}>Saved Shows</button></div>
                            <div className="border-b-2 py-2"><button className=" p-3 bg-slate-500  rounded-xl w-full"  onClick={() => goToProfile()}>Profile</button></div>
                            <div className="border-b-2 py-2"><button className=" p-3 bg-slate-500  rounded-xl  w-full"  onClick={() => router.push('./support')}>Support</button></div>
                            <div className="border-b-2 py-2"><button className=" p-3 bg-slate-500 rounded-xl  w-full" aria-describedby={id} variant="contained" onClick={()=> authSubmit()}>
                                {currentUser ? 'Sign Out' : "Sign In"}
                            </button></div>
                        </Typography>
                        </Popover>
                        </div>
                    </div>
                    <div className="flex flex-row justify-evenly pb-5 text-xl font-semibold">
                            <button className='' disabled = {disable} onClick={() => {
                                if(!disable){
                                    setIsLoading(true)
                                    router.push('./userpage')
                                }
                                
                                }}>Shows</button>
                            <button disabled={listDisable} onClick={() => {
                                if(!listDisable){
                                    setIsLoading(true)
                                    router.push('./userPersonalList')
                                }
                                
                                }}>My List</button>
                            <button disabled = {discoverDisable} onClick={() => {
                                if(!discoverDisable){
                                    setIsLoading(true)
                                    router.push("./searchTvseries")
                                }
                                }}>Discover</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header