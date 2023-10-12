// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAqIN39P1MnRcKaTLyUDM8Q8_PaD3Otozo",
  authDomain: "travel-ec723.firebaseapp.com",
  projectId: "travel-ec723",
  storageBucket: "travel-ec723.appspot.com",
  messagingSenderId: "492222616465",
  appId: "1:492222616465:web:93d0f0dce3fa9eea600030",
  measurementId: "G-X1R7CQ1EVX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
