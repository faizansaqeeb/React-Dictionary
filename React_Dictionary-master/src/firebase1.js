import firebase from "firebase"
import "firebase/auth"
const app=firebase.initializeApp({
    apiKey: "AIzaSyDZTlv0VRy33SpxTc5h11poQZjRqocVncg",
    authDomain: "dictionary-292cd.firebaseapp.com",
    projectId: "dictionary-292cd",
    storageBucket: "dictionary-292cd.appspot.com",
    messagingSenderId: "135542329479",
    appId: "1:135542329479:web:9b20470157b40792666822",
    measurementId: "G-SJYJENJCKX"
})
export default app;
export const googleprovider = new firebase.auth.GoogleAuthProvider();
export const facebookprovider= new firebase.auth.FacebookAuthProvider();