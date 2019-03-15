import React, { Component } from 'react';
import Nav from './components/nav/nav';
import Footer from './components/footer/footer';
import Stripe from './components/stripe/stripe';
import { Route } from 'react-router-dom';
//Views below here
import Login from './views/loginPage/login';
import LandingPage from './views/landingPage/LandingPage';

class App extends Component {
	render() {
		return (
			<div className='App'>
				<Route path='/' component={Nav} />
				<Route exact path='/' component={LandingPage} />
				<Route path='/login' exact component={Login} />
				<Route path='/subscribe' component={Stripe} />
				<Route path='/' component={Footer} />
			</div>
		);
	}
}

// please update your components and Routes as needed

export default App;
