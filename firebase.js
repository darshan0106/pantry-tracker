// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPPmv__Ynrxz_1B-IFq3lb1VgxkOgOR1U",
  authDomain: "pantry-tracker-52133.firebaseapp.com",
  projectId: "pantry-tracker-52133",
  storageBucket: "pantry-tracker-52133.appspot.com",
  messagingSenderId: "728773557569",
  appId: "1:728773557569:web:0ed029cce721a2c30275c0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { app, firestore };
