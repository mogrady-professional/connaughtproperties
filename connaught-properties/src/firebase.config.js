// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcNKl_yJ-OcT9hymgTlOjMoX415zN8cIM",
  authDomain: "connaughtproperties-ee67f.firebaseapp.com",
  projectId: "connaughtproperties-ee67f",
  storageBucket: "connaughtproperties-ee67f.appspot.com",
  messagingSenderId: "798761030644",
  appId: "1:798761030644:web:7f55e4caab08bdc9439fa1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();
