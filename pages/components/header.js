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



const Header = () =>{
    const [userPageValue, setUserPageValue] = useState('')
    const [isLoading, setIsLoading] = useState('')
    const auth = getAuth()
    const router = useRouter()
    const currentUser = auth.currentUser


    const handleSubmit = async (e) =>{
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
                <div className=' bg-slate-400 text-white'>
                    <div className='flex flex-row justify-between items-center mx-5'>
                        <div className="py-4">
                            <form className=" flex flex-row" onSubmit={(e) => handleSubmit(e)}>
                                <TextField id="standard-basic" label="Search" value={userPageValue} variant="standard" className='w-full' onChange={(e) =>{
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
                        ><Typography sx={{ p: 2 }} className="py-5 px-10 bg-gray-400">{currentUser ? `Welcome: ${currentUser.email}` : " "}<br></br>
                        <br></br>
                            <Button variant="contained" onClick={() => router.push('./userPersonalList')}>Saved Shows</Button><br></br>
                            <Button variant="contained" onClick={() => goToProfile()}>Profile</Button><br></br>
                            <Button aria-describedby={id} variant="contained" onClick={()=> authSubmit()}>
                                {currentUser ? 'Sign Out' : "Sign In"}
                            </Button>
                        </Typography>
                        </Popover>
                        </div>
                    </div>
                    <div className="flex flex-row justify-evenly pb-5 text-xl font-semibold">
                        <Link href='./userpage'>
                            <button className=''>Shows</button>
                        </Link>
                        <Link href='./userPersonalList'>
                            <button>My List</button>
                        </Link>
                        <Link href="./searchTvseries">
                            <button>Search</button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header