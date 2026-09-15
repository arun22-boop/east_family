import { initializeApp } from "firebase/app";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    getDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    where,
    onSnapshot,
    serverTimestamp,
    limit
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD44jXQ9D8uUnV6ksy_lOCbdkvtp0NlIlE",
    authDomain: "pkv-east.firebaseapp.com",
    projectId: "pkv-east",
    storageBucket: "pkv-east.firebasestorage.app",
    messagingSenderId: "702216526776",
    appId: "1:702216526776:web:4637013244764ff2fe8d4d",
    measurementId: "G-VDSF353Q95"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export {
    app,
    db,
    collection,
    addDoc,
    getDocs,
    getDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    where,
    onSnapshot,
    serverTimestamp,
    limit
};