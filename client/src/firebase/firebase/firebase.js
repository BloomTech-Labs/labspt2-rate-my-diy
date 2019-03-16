import app from 'firebase/app'
// import 'firebase/auth'
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
  app.initializeApp(config)
 }
}

export default Firebase