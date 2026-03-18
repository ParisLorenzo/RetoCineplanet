import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCS8CvcnffXoS5DSzOaLFnUcVCEFc94ro4",
  authDomain: "retocine-314f8.firebaseapp.com",
  projectId: "retocine-314f8",
  storageBucket: "retocine-314f8.firebasestorage.app",
  messagingSenderId: "616295976746",
  appId: "1:616295976746:web:54e05f1b1b89d723261853",
  measurementId: "G-D5ZBD53Q14"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
