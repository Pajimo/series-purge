import { getAuth,
    GoogleAuthProvider, 
    signInWithPopup,
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    sendEmailVerification,
    sendPasswordResetEmail } from "firebase/auth";
import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { Button } from '@mui/material';
import {firebaseConfig, database} from '../../firebaseConfig'
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/router'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from "./loadingScreen";
import {MdVisibility} from "react-icons/md";
import {MdVisibilityOff} from "react-icons/md";
import InputAdornment from '@mui/material/InputAdornment';
import { async } from "@firebase/util";

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


    useEffect(() =>{
      setIsLoading(false)
    }, [])

    const signUp = () =>{
        setIsLoading(true)
    createUserWithEmailAndPassword(auth, email, password)
    .then( async (userCredential) => {
      // Signed in 
      const q = query(collection(database, "users"), where("uid", "==", user.uid));
      const docs = await getDocs(q);
      if (docs.docs.length === 0) {
        await addDoc(collection(database, "users"), {
          uid: user.uid,
          name: firstName + " " + lastName,
          firstName: firstName,
          lastName: lastName,
          authProvider: "Email/Password",
          email: user.email,
        });
      }
      sendEmailVerification(auth.currentUser)
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
            setIsLoading(true)
            // Signed in 
            setUser(userCredential.user);
            toast('Signed In Successsfully')
            router.push('./userpage')     
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      if(error.code === 'auth/wrong-password'){
        toast.error('Invalid Password');
      }
      if(error.code === 'auth/user-not-found'){
        toast.error('Invalid Email Address');
      }
    });
    }

    const resetPassword =() =>{
      setIsLoading(true)
      sendPasswordResetEmail(auth, email)
        .then(() => {
          setIsLoading(false)
          toast('Password reset link sent your email')
          // Password reset email sent!
          // ..
        })
        .catch((error) => {
          setIsLoading(false)
          const errorCode = error.code;
          toast.error(errorCode)
          const errorMessage = error.message;
          // ..
        });
      }

    const googleProvider = new GoogleAuthProvider();
    const signInWithGoogle = async () => {
        setIsLoading(true)
        try {
            const res = await signInWithPopup(auth, googleProvider);
            const user = res.user;
            setUser(user)
            const q = query(collection(database, "users"), where("uid", "==", user.uid));
            const docs = await getDocs(q);
            if (docs.docs.length === 0) {
                await addDoc(collection(database, "users"), {
                    uid: user.uid,
                    name: user.displayName,
                    authProvider: "google",
                    email: user.email,
                });
            }
            router.push('./userpage')  
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
                  <div className="logo" onClick={() => router.push('./userpage')}></div>
                </div>
                <h1 className="text-4xl font-bold text-center">Create Account</h1>
                  <form  className="mt-5">
                        <TextField required className="mb-5" label="First Name" variant="standard" 
                            sx={{
                              width: 400,
                              maxWidth: '100%',
                            }}type="text" value={firstName} onChange={(e)=> setFIrstName(e.target.value)} /><br></br>
                            <TextField className="mb-5" label="Last Name" variant="standard" 
                          sx={{
                            width: 400,
                            maxWidth: '100%',
                          }}type="text" value={lastName} onChange={(e)=> setLastName(e.target.value)} /><br></br>
                    <TextField required className="mb-5" label="Email Address" variant="standard" 
                          sx={{
                            width: 400,
                            maxWidth: '100%',
                          }}type="email" value={email} onChange={(e)=> setEmail(e.target.value)} /><br></br>
                     <TextField required InputProps={{ endAdornment: <InputAdornment position="end" onClick={handleClickShowPassword}>
                          {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                      </InputAdornment>}}
                        className="mb-10 cursor-pointer" id="outlined-basic" label="Password" variant="standard" 
                        type={showPassword ? 'text' : "password"} value={password} onChange={(e)=> setPassword(e.target.value)} sx={{
                        width: 400,
                        maxWidth: '100%',
                        }}/><br></br>
                    <button className='w-full rounded-3xl mt-5 mb-5 bg-slate-400 p-2 text-lg font-semibold' onClick = {(e) =>{
                    e.preventDefault();
                    signUp()
                }} variant="contained" size="normal">Sign Up</button>
                <button className='w-full rounded-3xl mb-5 bg-slate-400 p-2 text-lg font-semibold' onClick = {(e) =>{
                    e.preventDefault();
                    signInWithGoogle()
                }} variant="contained" size="normal">Continue with Google</button>
                </form>
                <div>
                </div>
                <div>
                  <h1 className="text-lg text-center mb-2" > <button onClick={()=> {
                    setSignUp(false)
                    setLogin(true)}}
                    className='uppercase underline-offset-4 underline'>Already a Member? Log in here</button> </h1>
                </div>
                <div className="mb-10 text-lg uppercase underline-offset-4 underline text-center cursor-pointer">
                  <p onClick={()=> router.push('./userpage')}>Go to homepage</p>
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
                    <TextField required className="mb-5" label="Email Address" variant="standard"
                          sx={{
                            width: 400,
                            height: 60,
                            maxWidth: '100%',
                          }} type='email' value={email} onChange={(e)=> setEmail(e.target.value)} /><br></br>
                    <TextField required InputProps={{ endAdornment: <InputAdornment position="end" onClick={handleClickShowPassword}>
                          {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                      </InputAdornment>}}
                        className="mb-10 cursor-pointer" id="outlined-basic" label="Password" variant="standard" 
                        type={showPassword ? 'text' : "password"} value={password} onChange={(e)=> setPassword(e.target.value)} sx={{
                        width: 400,
                        maxWidth: '100%',
                        }}/><br></br>
                    <button className='w-full rounded-3xl mb-5 mt-5 bg-slate-400 p-2 text-lg font-semibold' onClick = {(e) =>{
                    e.preventDefault();
                    signIn()
                }} variant="contained" size="normal">Login</button><br></br>
                <button className='w-full rounded-3xl mb-10 bg-slate-400 p-2 text-lg font-semibold' onClick = {(e) =>{
                    e.preventDefault();
                    signInWithGoogle()
                }} variant="contained" size="normal">Continue with Google</button>
                </form>
                <div>
                </div>
                <div>
                  <p className="uppercase text-normal mb-5 underline-offset-4 text-center underline" onClick={() => resetPassword()}>Forgot Password?</p>
                </div>
                <div>
                  <h1 className="text-lg text-center">New Member? <button onClick={()=> {
                    setLogin(false)
                    setSignUp(true)}}
                    className='uppercase underline-offset-4 underline pb-2'>Create one</button> </h1>
                </div>
                <div className="mb-10 text-lg uppercase underline-offset-4 underline text-center cursor-pointer">
                  <p onClick={()=> router.push('./userpage')}>Go to homepage</p>
                </div>
              </div>
            </div>
          </div>
        </>
    )
}

export default LoginSignup