// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCLhPdPI7VGyZPeXY3T8nz8EiSLWpbXrAU",
  authDomain: "collabcampus-72ea4.firebaseapp.com",
  projectId: "collabcampus-72ea4",
  storageBucket: "collabcampus-72ea4.firebasestorage.app",
  messagingSenderId: "480842836872",
  appId: "1:480842836872:web:62767ed195b77f6141683d"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services to use elsewhere
export const auth = getAuth(app);
export const db = getFirestore(app);
