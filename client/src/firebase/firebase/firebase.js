import app from 'firebase/app';
import 'firebase/auth';
var config = {
	apiKey: 'AIzaSyA5At5iJg-ngD1uUquKrjflPdF7wxXJOsM',
	authDomain: 'ratemydiy-9453b.firebaseapp.com',
	databaseURL: 'https://ratemydiy-9453b.firebaseio.com',
	projectId: 'ratemydiy-9453b',
	storageBucket: 'ratemydiy-9453b.appspot.com',
	messagingSenderId: '714087561173',
};

class Firebase {
	constructor() {
		app.initializeApp(config);

		this.auth = app.auth();
	}

	addUserWithCreds = (email, password) => {
		this.auth.createUserWithEmailAndPassword(email, password);
	};

	signInWithCreds = (email, password) => {
		this.auth.signInWithEmailAndPassword(email, password);
	};

	signOut = () => this.auth.signOut();

	passWordReset = (email) => {
		this.auth.sendPasswordResetEmail(email);
	};

	passWordUpdate = (password) => {
		this.auth.currentUser.updatePassword(password);
	};
}

export default Firebase;
