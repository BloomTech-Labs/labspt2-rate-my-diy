import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
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
    this.emailAuthProvider = app.auth.EmailAuthProvider;
<<<<<<< HEAD
    this.serverValue = app.database.ServerValue;
    this.twitterProvider = new app.auth.TwitterAuthProvider()
    this.githubProvider = new app.auth.GithubAuthProvider()
=======
    this.fieldValue = app.firestore.FieldValue;
    this.emailAuthProvider = app.auth.EmailAuthProvider;
    this.db = app.firestore();
    this.db.settings({ timestampsInSnapshots: true });
>>>>>>> eb464ae9058938eeaa46602020fe2ecae27c4edf
  }

  doCreateUserWithEmailAndPassword = (email, password) => {
    this.auth
      .createUserWithEmailAndPassword(email, password)
      .then(response => console.log(response))
      .catch(err => console.log(err));
  };

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);


  doSignInWithTwitter = () => {
   this.auth.signInWithPopup(this.twitterProvider)
  }

  doSignWithGithub = () => {
   this.auth.signInWithPopup(this.githubProvider)
  }
  doSignOut = () => this.auth.signOut();

  doPassWordReset = email => {
    this.auth.sendPasswordResetEmail(email);
  };

  doPassWordUpdate = password => {
    this.auth.currentUser.updatePassword(password);
  };
}

export default Firebase;
