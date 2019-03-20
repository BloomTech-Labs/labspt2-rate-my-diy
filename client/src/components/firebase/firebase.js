import app from "firebase/app";
import "firebase/auth";
import "firebase/database";
import * as ROUTES from "../../constants/routes";

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
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.database();
    this.emailAuthProvider = app.auth.EmailAuthProvider;
    this.serverValue = app.database.ServerValue;
  }

  doCreateUserWithEmailAndPassword = (email, password) => {
    this.auth
      .createUserWithEmailAndPassword(email, password)
      .then(response => console.log(response))
      .catch(err => console.log(err));
  };

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPassWordReset = email => {
    this.auth.sendPasswordResetEmail(email);
  };

  doPassWordUpdate = password => {
    this.auth.currentUser.updatePassword(password);
  };
}

export default Firebase;
