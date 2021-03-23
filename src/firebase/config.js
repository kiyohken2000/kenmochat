import * as firebase from 'firebase'
import "firebase/auth"
import "firebase/firestore"
import "firebase/storage"


const firebaseConfig = {
  apiKey: "AIzaSyAJiKLnPpNUiZkwP2dqe7VD7IKOkB4vljU",
  authDomain: "kenmochat.firebaseapp.com",
  databaseURL: "https://kenmochat-default-rtdb.firebaseio.com",
  projectId: "kenmochat",
  storageBucket: "kenmochat.appspot.com",
  messagingSenderId: "866526446291",
  appId: "1:866526446291:web:e3ed6135f0f0b4ea160a26",
  measurementId: "G-LMGPDCEJMZ"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
