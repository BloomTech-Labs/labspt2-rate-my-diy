import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

var config = {
  apiKey: 'AIzaSyA5At5iJg-ngD1uUquKrjflPdF7wxXJOsM',
  authDomain: 'ratemydiy-9453b.firebaseapp.com',
  databaseURL: 'https://ratemydiy-9453b.firebaseio.com',
  projectId: 'ratemydiy-9453b',
  storageBucket: 'ratemydiy-9453b.appspot.com',
  messagingSenderId: '714087561173',
}

class Firebase {
  constructor() {
    app.initializeApp(config)
    this.auth = app.auth()
    this.emailAuthProvider = app.auth.EmailAuthProvider
    this.fieldValue = app.firestore.FieldValue
    this.emailAuthProvider = app.auth.EmailAuthProvider
    this.db = app.firestore()
    this.github = new app.auth.GithubAuthProvider()
    this.google = new app.auth.GoogleAuthProvider()
    this.twitter = new app.auth.TwitterAuthProvider()
  }

  doCreateUserWithEmailAndPassword = (email, password) => {
    return this.auth.createUserWithEmailAndPassword(email, password)
  }

  doSignInWithEmailAndPassword = (email, password) => {
    return this.auth.signInWithEmailAndPassword(email, password)
  }

  doSignInWithTwitter = () => {
    return this.auth.signInWithPopup(this.twitter)
  }

  doSignInWithGithub = () => {
    return this.auth.signInWithPopup(this.github)
  }

  doSignInWithGoogle = () => {
    return this.auth.signInWithPopup(this.google)
  }
  doSignOut = () => this.auth.signOut()

  doPasswordReset = (email) => {
    return this.auth.sendPasswordResetEmail(email)
  }

  doPasswordUpdate = (password) => {
    return this.auth.currentUser.updatePassword(password)
  }

  // doSendEmailVerification = () => {
  //  this.auth.currentUser.sendEmailVerification({
  //   url: process.env.port
  //  })
  // }

  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        this.user(authUser.uid)
          .get()
          .then((snapshot) => {
            const dbUser = snapshot.data()

            // merge auth and db user
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              emailVerified: authUser.emailVerified,
              providerData: authUser.providerData,
              ...dbUser,
            }

            next(authUser)
          })
      } else {
        fallback()
      }
    })

  // User API
  user = (uid) => this.db.doc(`users/${uid}`)
  users = () => this.db.collection('users')

  // Message API
  message = (uid) => this.db.doc(`messages/${uid}`)
  message = () => this.db.collection('messages')
}

export default Firebase

/*
1. Click Sign In with oAuth Provider.
2. UID from 3rd party is checked in fireBase to see if it exists.
3 If it exists, send user to homePage if not send user to more info page to collect the username and email.
4. Send username, 3rd party uID and email to firebase.
5. Send out welcome email to the email.
6. Send uID + email + username to Prisma
*/
