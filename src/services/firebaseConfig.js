import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getDatabase, ref, set, onValue, remove } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBKLkbT2_MaDWcI1FwPC0BpS1M_lpX3Jqc",
    authDomain: "test-multiplayer-7e40a.firebaseapp.com",
    projectId: "test-multiplayer-7e40a",
    storageBucket: "test-multiplayer-7e40a.firebasestorage.app",
    messagingSenderId: "1040797569569",
    appId: "1:1040797569569:web:e5fc978050638639cc4960",
    measurementId: "G-TKBKVMBMT4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, database, ref, set, onValue, remove };