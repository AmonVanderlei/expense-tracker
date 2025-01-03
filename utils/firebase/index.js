// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCp4cAw2-L1sHPL_L6An6F_v8v8_qmsTqQ",
  authDomain: "expenses-tracker-3523d.firebaseapp.com",
  projectId: "expenses-tracker-3523d",
  storageBucket: "expenses-tracker-3523d.firebasestorage.app",
  messagingSenderId: "610050297000",
  appId: "1:610050297000:web:64f41575744bdf3576869d",
  measurementId: "G-L8VRNLWVWZ",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
