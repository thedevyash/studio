// src/config.ts

const config = {
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_APIKEY_FIRE,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  },
};

// Basic validation
if (!config.firebase.apiKey) {
  throw new Error("Missing NEXT_PUBLIC_APIKEY_FIRE environment variable.");
}

export default config;
