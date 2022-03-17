import { getAuth, signOut } from "firebase/auth";
import {  useState } from "react"
import {firebaseConfig, database} from '../../firebaseConfig'
import { Button } from "@mui/material";
import { useRouter } from 'next/router'
import { BsPersonFill } from "react-icons/bs";
import { AiOutlineZoomIn } from "react-icons/ai";
import Link from 'next/link';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Loading from "./loadingScreen";



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
            router.push('./authentication')
        }
    }

    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;


    if(isLoading){
        return(
            <Loading setIsLoading={setIsLoading}/>
          )
    }
    return(
        <>
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
                        <Button aria-describedby={id} variant="contained" onClick={handleClick}>
                            <BsPersonFill />
                        </Button>
                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                            }}
                        ><Typography sx={{ p: 2 }}>{currentUser ? `Welcome: ${currentUser.email}` : " "}<br></br>
                            <Button variant="contained" onClick={() => router.push('./userPersonalList')}>Saved Shows</Button><br></br>
                            <Button variant="contained" onClick={() => router.push('./')}>Profile</Button><br></br>
                            <Button aria-describedby={id} variant="contained" onClick={()=> authSubmit()}>
                                {currentUser ? 'Sign Out' : "Sign In"}
                            </Button>
                        </Typography>
                        </Popover>
                        </div>
                    </div>
                    <div className="flex flex-row justify-evenly pb-5">
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