import React, { Component } from 'react';
import * as ROUTES from '../../../constants/routes';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../../Firebase/Exports';
import AdditionalInfo from './AdditionInfo';

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/account-exists-with-different-credential';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with an E-Mail address to
  this social account already exists. Try to login from
  this account instead and associate your social accounts on
  your personal account page.
`;

class SignInGithubBase extends Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
		};
	}

	setError = (errVal) => {
		this.setState({
      errVal,
      isNewUser: false
		});
	};
	onSubmit = (event) => {
		this.props.firebase
			.doSignInWithGithub()
			// console.log(this.props, 'home page props')
			.then((socialAuthUser) => {
				// 1. Catch GH user object here, parse it for isNewUser project, ifNewUser === true, push to More Info page
				console.log('response from gitHub:', socialAuthUser);
				var userBooleanValue = JSON.parse(socialAuthUser.additionalUserInfo.isNewUser);
				console.log('userBooleanValue', userBooleanValue);
				if (userBooleanValue) {
					/* userBooleanValue variable is set to the isNewUser key on the GH object,
      if that value === true, then push the route to more info page?
     */
          // We could use if-else do-while or switch statement instead of while
          this.setState({isNewUser: true})
					// this.props.history.push(ROUTES.MORE_INFO);
				} else {
					this.props.history.push(ROUTES.HOME);
				}
				console.log(socialAuthUser.user.providerData['0'].uid);
				return this.props.firebase.user(socialAuthUser.user.providerData['0'].uid).set({
					email: socialAuthUser.user.email,
				});
			})
			.catch((err) => {
				console.log('err ', err);
				if (err.code === ERROR_CODE_ACCOUNT_EXISTS) {
					err.message = ERROR_MSG_ACCOUNT_EXISTS;
				}
				this.setError(err);
			});
		event.preventDefault();
	};
	render() {
		const { error } = this.state;
		return (
      <>
			<form onSubmit={this.onSubmit}>
				<button type='submit'> Sign In with Github </button> {error && <p> {error.message} </p>}
      </form>
      {this.state.isNewUser === true  && <AdditionalInfo/>}
      </>
		);
	}
}

const SignInGithub = compose(withRouter, withFirebase)(SignInGithubBase);

export default SignInGithub;
