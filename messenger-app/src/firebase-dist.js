// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API",
    authDomain: "YOUR_INFO",
    projectId: "YOUR_INFO",
    storageBucket: "YOUR_INFO",
    messagingSenderId: "YOUR_INFO",
    appId: "YOUR_INFO"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const db = getFirestore();