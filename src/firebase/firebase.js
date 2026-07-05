// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPhoneNumber, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  RecaptchaVerifier
} from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyBglaEnVzIJRb8Vz7XWXcU_-vEmtyygcnE",
  authDomain: "aora-7e7cf.firebaseapp.com",
  projectId: "aora-7e7cf",
  storageBucket: "aora-7e7cf.firebasestorage.app",
  messagingSenderId: "216818455449",
  appId: "1:216818455449:web:30a7c68022185fc4db3908"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Export auth functions
export { 
  signInWithPhoneNumber, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut, 
  onAuthStateChanged,
  RecaptchaVerifier 

};