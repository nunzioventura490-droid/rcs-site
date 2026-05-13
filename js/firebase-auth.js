import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAQG5BPuNLtNSv6kn6-0D22RhLX9BUonO8",
  authDomain: "rcs-tesi.firebaseapp.com",
  projectId: "rcs-tesi",
  storageBucket: "rcs-tesi.firebasestorage.app",
  messagingSenderId: "634306333804",
  appId: "1:634306333804:web:462baf0285d05e57da9c49",
  measurementId: "G-CN57Y6DZ3J"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export { signInWithEmailAndPassword, signOut, onAuthStateChanged };
export const toEmail = u => `${u}@rcs-tesi.app`;
