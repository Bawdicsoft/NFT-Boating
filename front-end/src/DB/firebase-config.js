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
  apiKey: "AIzaSyASzhoxdX8TGXXZsPNxT7uuUaJimGwioCo",
  authDomain: "nftboating-f659d.firebaseapp.com",
  projectId: "nftboating-f659d",
  storageBucket: "nftboating-f659d.appspot.com",
  messagingSenderId: "441287601820",
  appId: "1:441287601820:web:8e90a7aae953f54fb4c759",
  measurementId: "G-D225S5NJGH",
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
        user: true,
        host: false,
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
