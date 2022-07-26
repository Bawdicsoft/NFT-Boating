import firebase from 'firebase'
import 'firebase/firestore';
  
 const firebaseConfig = firebase.initializeApp( {
    apiKey: "AIzaSyCg9PuBxn8l6Z2ACnyl4XKT00AtL1SFow0",
    authDomain: "nft-boating.firebaseapp.com",
    projectId: "nft-boating",
    storageBucket: "nft-boating.appspot.com",
    messagingSenderId: "658938979492",
    appId: "1:658938979492:web:5f754b947e6ca632787231"
  });

 const auth = firebase.auth();
 const provider = new firebase.auth.GoogleAuthProvider();

 const db= firebaseConfig.firestore();
 const storage = firebase.storage()

export { auth, provider, db, storage,}