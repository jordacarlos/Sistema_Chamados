import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/firestore'
import 'firebase/storage'

let firebaseConfig = {
  apiKey: "AIzaSyB1ThVjZgr-joNHNdnXuOSri5PUlH6sACg",
  authDomain: "sistema-63c78.firebaseapp.com",
  projectId: "sistema-63c78",
  storageBucket: "sistema-63c78.appspot.com",
  messagingSenderId: "244782682322",
  appId: "1:244782682322:web:f5a8f17ecfc753a0d1dd0b",
  measurementId: "G-Y5NESYD6C2"
};

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

export default firebase;