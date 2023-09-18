import firebase from 'firebase/compat/app'
import 'firebase/compat/auth';

 firebase.initializeApp({
  apiKey: "AIzaSyC571P2EEx4zzuTCtD7Ky2Zho970SF4jE8",
  authDomain: "clone-26b37.firebaseapp.com",
  projectId: "clone-26b37",
  storageBucket: "clone-26b37.appspot.com",
  messagingSenderId: "48084817918",
  appId: "1:48084817918:web:0fa173023d289cb7b092af",
  measurementId: "G-V4WS8VHZLX"
});

const auth = firebase.auth();

export {auth};
