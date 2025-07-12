// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.apikey_fire,
  authDomain: "habithorizon-ea3b2.firebaseapp.com",
  projectId: "habithorizon-ea3b2",
  storageBucket: "habithorizon-ea3b2.storage.app",
  messagingSenderId: "675786351708",
  appId: "1:675786351708:web:0879836339d772f050f299"
};

// Initialize Firebase
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

export { app, auth, db, storage };
