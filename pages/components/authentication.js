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
  
const LoginSignup = () =>{

    const auth = getAuth();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [user, setUser] = useState([])
    const [isLoading, setIsLoading] = useState(false)

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

    if(isLoading){
        return(
            <Loading setIsLoading={setIsLoading}/>
          )
    }


    return(
        <>
        <ToastContainer />
        <Header />
            <div>
                <h1>Login / Signup</h1>
                <h2>welcome {user.email}</h2>
                <form>
                    <TextField label="Email Address" variant="standard" 
                          sx={{
                            width: 400,
                            maxWidth: '100%',
                          }}type="text" value={email} onChange={(e)=> setEmail(e.target.value)} /><br></br>
                    <TextField id="outlined-basic" label="Password" variant="standard" 
                    type="password" value={password} onChange={(e)=> setPassword(e.target.value)} sx={{
                        width: 400,
                        maxWidth: '100%',
                      }}/><br></br>
                    <Button onClick = {(e) =>{
                    e.preventDefault();
                    signIn()
                }} variant="contained" size="large">Login</Button><br></br>
                    <Button onClick = {(e) =>{
                    e.preventDefault();
                    signUp()
                }} variant="contained" size="large">Sign Up</Button>
                <Button onClick = {(e) =>{
                    e.preventDefault();
                    signInWithGoogle()
                }} variant="contained" size="large">Sign In with Google</Button>
                </form>
                <div>
                </div>
            </div>
            
        </>
    )
}

export default LoginSignup