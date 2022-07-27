import { initializeApp } from "firebase/app"
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
} from "firebase/auth"
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore"
import { getStorage } from "firebase/storage"

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBmi0XxvTAAIK7ufLoEabe5PgJj3okOvs4",
  authDomain: "nft-yacht.firebaseapp.com",
  projectId: "nft-yacht",
  storageBucket: "nft-yacht.appspot.com",
  messagingSenderId: "755723829636",
  appId: "1:755723829636:web:7ed9d98fce9f146ba01dd1",
  measurementId: "G-2QKMN1F2XR",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)
const googleProvider = new GoogleAuthProvider()

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider)
    const user = res.user

    console.log({ user })
    const q = query(collection(db, "users"), where("uid", "==", user.uid))
    const docs = await getDocs(q)
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
        photoURL: user.photoURL,
      })
    }
  } catch (err) {
    console.error(err)
    alert(err.message)
  }
}

const logout = async () => {
  console.log("clicked")
  return signOut(auth)
}

export { auth, db, signInWithGoogle, logout, storage }
