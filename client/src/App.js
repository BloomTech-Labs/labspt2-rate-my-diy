import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import * as ROUTES from './constants/routes';
import Navigation from './reactRouter/reactRouter';
import Home from './components/Home/Home';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import SearchPage from './components/SearchPage/SearchPage'
import PasswordForget from './components/PasswordForget/PasswordForget';
import Footer from './components/Footer/Footer';
import Account from './components/Account/Account'
import PasswordChange from './components/PasswordChange/PasswordChange';
import {withAuthentication} from './components/Session/session';

class App extends Component {
	constructor() {
		super();
		this.state = {
		  users: [],
		  projects: [],
		  reviews: []
		};
	}

	searchHandler = (users, reviews, projects) => {
		if (users) {
		  this.setState({ users });
		}
		if (reviews) {
		  this.setState({ reviews });
		}
		if (projects) {
		  this.setState({ projects });
		}
	
		console.log({users, projects, reviews})
	};

	render() {
    return (
			<Router>
				<div>
					<Navigation />
					<Route exact path={ROUTES.HOME} render={props => <Home {...props} searchHandler={this.searchHandler} />} />
					<Route path={ROUTES.SIGN_IN} component={SignIn} />
					<Route path={ROUTES.SIGN_UP} component={SignUp} />
					<Route path={ROUTES.PASSWORD_FORGET} component={PasswordForget} />
					<Route path={ROUTES.PASSWORD_CHANGE} component={PasswordChange} />
					<Route path={ROUTES.SEARCH} render={props => <SearchPage {...props} users={this.state.users} projects={this.state.projects} reviews={this.state.reviews} searchHandler={this.searchHandler} />} />
					<Route path={ROUTES.ACCOUNT} component={Account} />
					<Route path={ROUTES.FOOTER} component={Footer} />
				</div>
			</Router>
		);
	}
}

// please update your components and Routes as needed

export default withAuthentication(App);
