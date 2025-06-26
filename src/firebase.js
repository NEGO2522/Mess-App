import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // <-- add this

const firebaseConfig = {
  apiKey: "AIzaSyDgffBgHNXRAw9NoxrHW5NRBVlbPuI0c8w",
  authDomain: "mess-3c72e.firebaseapp.com",
  projectId: "mess-3c72e",
  storageBucket: "mess-3c72e.firebasestorage.app",
  messagingSenderId: "934962786207",
  appId: "1:934962786207:web:2ae4415d96511de67657aa",
  measurementId: "G-GFBBRJ9G4W"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app); // <-- export auth
export const googleProvider = new GoogleAuthProvider(); // <-- export provider