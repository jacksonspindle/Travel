import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";

// Your web app's Firebase configuration
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
// const analytics = getAnalytics(app);
let db;
let auth;

try {
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.error("Error initializing Firebase services:", error);
}

// const auth = getAuth(app);

export const login = async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Failed to login", error);
  }
};

export const logout = () => {
  signOut(auth);
};

export const authStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export { auth, db };
