import React, { Component } from 'react';
import { compose } from 'recompose';
import * as ROUTES from '../../../constants/routes';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../../Firebase/Exports';

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/account-exists-with-different-credential';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with an E-Mail address to
  this social account already exists. Try to login from
  this account instead and associate your social accounts on
  your personal account page.
`;

class SignInGoogleBase extends Component {
	constructor(props) {
		super(props);

		this.state = {
			error: null,
		};
	}

	submitHandler = (event) => {
		this.props.firebase
			.doSignInWithGoogle()
			.then((socialAuthUser) => {
        console.log(socialAuthUser, 'return from Google')
        var userBooleanValue = JSON.parse(socialAuthUser.additionalUserInfo.isNewUser);
        console.log(userBooleanValue, 'newUser Indicator');
				if (userBooleanValue) {
					// do this if UserBooLeanValue === true
				} else this.props.history.push(ROUTES.HOME);
				return this.props.firebase.user(socialAuthUser.user.uid).set(
					{
						username: socialAuthUser.user.displayName,
						email: socialAuthUser.user.email,
					},
					{ merge: true },
				);
			})
			.catch((error) => {
				if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
					error.message = ERROR_MSG_ACCOUNT_EXISTS;
				}
				this.setState({
					error,
				});
			});
		event.preventDefault();
	};
	render() {
		const { error } = this.state;
		return (
			<form onSubmit={this.submitHandler}>
				<button type='submit'>Sign In With Google</button>
				{error && <p>{error.message}</p>}
			</form>
		);
	}
}

const GoogleBase = compose(withRouter, withFirebase)(SignInGoogleBase);

export default GoogleBase;
