// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDLS4sQDasCUJbaIQ0HzUnYPjTKSZIW5ro",
  authDomain: "healthyfood-6dff7.firebaseapp.com",
  projectId: "healthyfood-6dff7",
  storageBucket: "healthyfood-6dff7.appspot.com",
  messagingSenderId: "507837409097",
  appId: "1:507837409097:web:37301e14c2314214655c98"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
