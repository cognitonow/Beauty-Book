import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration, taken from the prompt.
const firebaseConfig = {
  apiKey: "AIzaSyD6fLkmBeuVerhtXvIdZGOjWwltxRCSe2U",
  authDomain: "beauty-book-375d5.firebaseapp.com",
  projectId: "beauty-book-375d5",
  storageBucket: "beauty-book-375d5.firebasestorage.app",
  messagingSenderId: "208401477894",
  appId: "1:208401477894:web:7d02b5c2752b44d0116e87",
  measurementId: "G-FQNHHG0YDN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
