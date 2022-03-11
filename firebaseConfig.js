// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFireStore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB43TaYqgcPCjPbQ1Bp85WpwsVNgAySHDA",
  authDomain: "series-purge.firebaseapp.com",
  projectId: "series-purge",
  storageBucket: "series-purge.appspot.com",
  messagingSenderId: "428558457197",
  appId: "1:428558457197:web:c95f0092142615f0692264",
  measurementId: "G-XDRYX325QF"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const database  = getFireStore(app)