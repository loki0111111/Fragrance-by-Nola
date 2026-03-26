import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCuadkW7Rgwdp3-BjhkHb9hEm4fuKiKZ9k",
  authDomain: "fragrance-by-nola.firebaseapp.com",
  projectId: "fragrance-by-nola",
  storageBucket: "fragrance-by-nola.firebasestorage.app",
  messagingSenderId: "297106534408",
  appId: "1:297106534408:web:b4f08d479597a90ab0e1bd",
  measurementId: "G-JQS2V5J8JQ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };