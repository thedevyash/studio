
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7RLj7A6Dqzd5kj9jqCFrriRGKTNyHZ5c",
  authDomain: "habithorizon-ea3b2.firebaseapp.com",
  projectId: "habithorizon-ea3b2",
  storageBucket: "habithorizon-ea3b2.firebasestorage.app",
  messagingSenderId: "675786351708",
  appId: "1:675786351708:web:0879836339d772f050f299"
};

// Initialize Firebase for SSR
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const getFirebaseAuth = (): Auth => getAuth(app);
const getFirebaseDb = (): Firestore => getFirestore(app);

export { app, getFirebaseAuth, getFirebaseDb };
