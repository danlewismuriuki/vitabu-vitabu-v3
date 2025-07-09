// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAXWZN51rC1fJaStWAAdONanQD-XZyYeK0",
  authDomain: "vitabu-vitabu-v2.firebaseapp.com",
  projectId: "vitabu-vitabu-v2",
  storageBucket: "vitabu-vitabu-v2.firebasestorage.app",
  messagingSenderId: "314006205810",
  appId: "1:314006205810:web:fd724974cecfb7f86319eb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export {app, auth};