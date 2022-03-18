import { getAuth,
    GoogleAuthProvider, 
    signInWithPopup,
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    sendEmailVerification } from "firebase/auth";
import { useState } from "react";
import { Button } from '@mui/material';
import {firebaseConfig, database} from '../../firebaseConfig'
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/router'
import { ToastContainer, toast } from 'react-toastify';
import UserPage from './userpage'
import 'react-toastify/dist/ReactToastify.css';
import Loading from "./loadingScreen";
import Header from './header'
import {MdVisibility} from "react-icons/md";
import {MdVisibilityOff} from "react-icons/md";
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

const LoginSignup = () =>{

    const auth = getAuth();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [user, setUser] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [login, setLogin] = useState(true)
    const [signup, setSignUp] = useState(false)
    const [firstName, setFIrstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const router = useRouter()


    const signUp = () =>{
        setIsLoading(true)
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      setUser(userCredential.user);
      router.push('./userpage') 
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      console.log(errorCode)
      const errorMessage = error.message;
      console.log(errorMessage)
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('Email Already in Use');
      }
      console.log(error)
      // ..
    });
}
  
    const signIn = async () =>{
         signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            setIsLoading(true)
            setUser(userCredential.user);
            toast('Signed In Successsfully')
            router.push('./userpage')     
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      if(error.code === 'auth/wrong-password'){
        toast.error('Please check the Password');
      }
      if(error.code === 'auth/user-not-found'){
        toast.error('Please check the Email');
      }
    });
    }

    const googleProvider = new GoogleAuthProvider();
    const signInWithGoogle = async () => {
        setIsLoading(true)
        try {
            const res = await signInWithPopup(auth, googleProvider);
            const user = res.user;
            const q = query(collection(db, "users"), where("uid", "==", user.uid));
            const docs = await getDocs(q);
            if (docs.docs.length === 0) {
                await addDoc(collection(db, "users"), {
                    uid: user.uid,
                    name: user.displayName,
                    authProvider: "google",
                    email: user.email,
                });
            }
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    const handleClickShowPassword = () =>{
      setShowPassword(!showPassword)
    }

    if(isLoading){
        return(
            <Loading setIsLoading={setIsLoading}/>
          )
    }

    if(signup){
      return(
        <>
          <ToastContainer />
          <div className='md:flex md:flex-row'>
            <div className="md:h-screen h-48 md:basis-1/2 bg-cover bg-center bg-no-repeat" style={{backgroundImage: `url("https://s.marketwatch.com/public/resources/images/MW-GF945_billio_ZG_20180321134639.jpg")`}}>
            </div>
            <div className='md:basis-1/2 mx-5 md:flex md:justify-center'>
              <div>
                <div className="flex justify-center">
                  <div className="logo"></div>
                </div>
                <h1 className="text-4xl font-bold text-center">Create Account</h1>
                  <form  className="mt-5">
                        <TextField className="mb-5" label="First Name" variant="standard" 
                            sx={{
                              width: 400,
                              maxWidth: '100%',
                            }}type="text" value={firstName} onChange={(e)=> setFIrstName(e.target.value)} /><br></br>
                            <TextField className="mb-5" label="Last Name" variant="standard" 
                          sx={{
                            width: 400,
                            maxWidth: '100%',
                          }}type="text" value={lastName} onChange={(e)=> setLastName(e.target.value)} /><br></br>
                    <TextField className="mb-5" label="Email Address" variant="standard" 
                          sx={{
                            width: 400,
                            maxWidth: '100%',
                          }}type="text" value={email} onChange={(e)=> setEmail(e.target.value)} /><br></br>
                     <TextField InputProps={{ endAdornment: <InputAdornment position="end" onClick={handleClickShowPassword}>
                          {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                      </InputAdornment>}}
                        className="mb-10" id="outlined-basic" label="Password" variant="standard" 
                        type={showPassword ? 'text' : "password"} value={password} onChange={(e)=> setPassword(e.target.value)} sx={{
                        width: 400,
                        maxWidth: '100%',
                        }}/><br></br>
                    <Button className='w-full rounded-3xl mb-10' onClick = {(e) =>{
                    e.preventDefault();
                    signUp()
                }} variant="contained" size="normal">Sign Up</Button>
                <Button className='w-full rounded-3xl mb-10' onClick = {(e) =>{
                    e.preventDefault();
                    signInWithGoogle()
                }} variant="contained" size="normal">Sign In with Google</Button>
                </form>
                <div>
                </div>
                <div>
                  <h1 className="text-lg text-center" >Already a Member? Log in <button onClick={()=> {
                    setSignUp(false)
                    setLogin(true)}}
                    className='uppercase underline-offset-4 underline'>here</button> </h1>
                </div>
                </div>
            </div>
          </div>
        </>
      )
    }


    return(
        <>
        <ToastContainer />
          <div className='md:flex md:flex-row'>
            <div className="md:h-screen h-48 md:basis-1/2 bg-cover bg-center bg-no-repeat" style={{backgroundImage: `url("https://img-www.tf-cdn.com/show/2/all-american-homecoming.jpeg")`}}>
            </div>
            <div className='md:basis-1/2 mx-5 md:flex md:justify-center'>
              <div>
                <div className="flex justify-center">
                  <div className="logo"></div>
                </div>

                <h1 className="text-4xl font-bold text-center">Welcome</h1>
                <p className='text-center'>Log in to access your Tv-show list</p>
                <form className="mt-10">
                    <TextField className="mb-5" label="Email Address" variant="standard"
                          sx={{
                            width: 400,
                            maxWidth: '100%',
                          }}type="text" value={email} onChange={(e)=> setEmail(e.target.value)} /><br></br>
                    <TextField InputProps={{ endAdornment: <InputAdornment position="end" onClick={handleClickShowPassword}>
                          {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                      </InputAdornment>}}
                        className="mb-10" id="outlined-basic" label="Password" variant="standard" 
                        type={showPassword ? 'text' : "password"} value={password} onChange={(e)=> setPassword(e.target.value)} sx={{
                        width: 400,
                        maxWidth: '100%',
                        }}/><br></br>
                    <Button className='w-full rounded-3xl mb-10' onClick = {(e) =>{
                    e.preventDefault();
                    signIn()
                }} variant="contained" size="normal">Login</Button><br></br>
                <Button className='w-full rounded-3xl mb-10' onClick = {(e) =>{
                    e.preventDefault();
                    signInWithGoogle()
                }} variant="contained" size="normal">Continue with Google</Button>
                </form>
                <div>
                </div>
                <div>
                  <h1 className="text-lg text-center">New Member? <button onClick={()=> {
                    setLogin(false)
                    setSignUp(true)}}
                    className='uppercase underline-offset-4 underline'>Create one</button> </h1>
                </div>
              </div>
            </div>
          </div>
        </>
    )
}

export default LoginSignup