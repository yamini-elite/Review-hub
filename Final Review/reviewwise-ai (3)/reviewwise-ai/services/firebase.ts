import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyC5CAY8Q0dCzy11C3BAOKPnoiysPqXjufI",
    authDomain: "review-hub-25af0.firebaseapp.com",
    projectId: "review-hub-25af0",
    storageBucket: "review-hub-25af0.firebasestorage.app",
    messagingSenderId: "79635801846",
    appId: "1:79635801846:web:1d5ce53e57011186212ed7",
    measurementId: "G-0TZD8ES84Y"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);