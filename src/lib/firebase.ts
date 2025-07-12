
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// Your web app's Firebase configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyC7RLj7A6Dqzd5kj9jqCFrriRGKTNyHZ5c",
  authDomain: "habithorizon-ea3b2.firebaseapp.com",
  projectId: "habithorizon-ea3b2",
  storageBucket: "habithorizon-ea3b2.appspot.com",
  messagingSenderId: "675786351708",
  appId: "1:675786351708:web:0879836339d772f050f299"
};

// A helper function to determine if Firebase is configured
export const isFirebaseConfigured = !!firebaseConfig.apiKey;


if (!isFirebaseConfigured) {
    console.warn(`Firebase configuration is incomplete. Some features will be disabled.`);
    // To prevent crashes when Firebase is not configured, we can assign dummy objects
    // or handle this more gracefully in the consuming components.
} else {
    // Initialize Firebase
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
}

export { app, auth, db };
