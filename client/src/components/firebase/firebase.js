// import app from 'firebase/app'
// import 'firebase/auth'

const database = require("firebase/database");
const firebase = require("firebase/app");
const firebaseAuth = require("firebase/auth");

var config = {
  apiKey: "AIzaSyA5At5iJg-ngD1uUquKrjflPdF7wxXJOsM",
  authDomain: "ratemydiy-9453b.firebaseapp.com",
  databaseURL: "https://ratemydiy-9453b.firebaseio.com",
  projectId: "ratemydiy-9453b",
  storageBucket: "ratemydiy-9453b.appspot.com",
  messagingSenderId: "714087561173"
};

class Firebase {
  constructor() {
    firebase.initializeApp(config);
    this.auth = firebaseAuth;
  }

  doCreateUserWithEmailAndPassword = (email, password) => {
    this.auth.createUserWithEmailAndPassword(email, password);
  };

  doSignInWithCreds = (email, password) => {
    this.auth.signInWithEmailAndPassword(email, password);
  };

  doSignOut = () => this.auth.signOut();

  doPassWordReset = email => {
    this.auth.sendPasswordResetEmail(email);
  };

  doPassWordUpdate = password => {
    this.auth.currentUser.updatePassword(password);
  };
}

export default Firebase;
