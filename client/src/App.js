import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { getUsers, getProjects, getReviews } from './query/query';
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

	projectSearchHandler = (projects) => {
		  this.setState({ projects });
		
	
		console.log({projects: this.state.projects})
	};

	userSearchHandler = (users) => {
		this.setState({ users });
	

	console.log(this.state.users)
};

reviewSearchHandler = (reviews) => {
	this.setState({ reviews });


console.log(this.state.reviews)
};

	render() {
    return (
			<Router>
				<div>
					<Navigation />
					<Route exact path={ROUTES.HOME} render=
						{
							props => (
							<Home 
								{...props} 
								projectSearchHandler={this.projectSearchHandler} 
								userSearchHandler={this.userSearchHandler}
								reviewSearchHandler={this.reviewSearchHandler}
								getUsers={getUsers} 
								getProjects={getProjects} 
								getReviews={getReviews} 
							/>)
						} 
					/>
					<Route path={ROUTES.SIGN_IN} component={SignIn} />
					<Route path={ROUTES.SIGN_UP} component={SignUp} />
					<Route path={ROUTES.PASSWORD_FORGET} component={PasswordForget} />
					<Route path={ROUTES.PASSWORD_CHANGE} component={PasswordChange} />
					<Route path={ROUTES.SEARCH} render=
						{
							props => (
								<SearchPage 
									{...props} 
									users={this.state.users} 
									projects={this.state.projects} 
									reviews={this.state.reviews} 
									projectSearchHandler={this.projectSearchHandler} 
									userSearchHandler={this.userSearchHandler}
									reviewSearchHandler={this.reviewSearchHandler}
									getUsers={getUsers} 
									getProjects={getProjects} 
									getReviews={getReviews}
								/>)
						} 
					/>
					<Route path={ROUTES.ACCOUNT} component={Account} />
          <Route path={ROUTES.FOOTER} component={Footer} />
				</div>
			</Router>
		);
	}
}

// please update your components and Routes as needed

export default withAuthentication(App);
