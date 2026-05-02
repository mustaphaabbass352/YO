import { initializeApp } from "firebase/app"
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCanxUQja6plOxpRAgxDLTxN0iHgV_Glb8",
  authDomain: "yo-app-4168d.firebaseapp.com",
  projectId: "yo-app-4168d",
  storageBucket: "yo-app-4168d.firebasestorage.app",
  messagingSenderId: "815909893038",
  appId: "1:815909893038:web:82714ae4b7483ad0a78e3f",
  measurementId: "G-CVNVVP2WHN"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export { RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential }