// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPy4tBWLden5jlA5is0ymFTR8QneEOX3A",
  authDomain: "tellu-a1bb2.firebaseapp.com",
  databaseURL: "https://tellu-a1bb2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tellu-a1bb2",
  storageBucket: "tellu-a1bb2.firebasestorage.app",
  messagingSenderId: "922231942710",
  appId: "1:922231942710:web:f3623cf5fb5083befcf297",
  measurementId: "G-HJDLLZXZEZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Firebase Auth instance

export { auth };
export default app;