import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../../components/Firebase/Exports';
import * as ROUTES from '../../constants/routes';
import gql from 'graphql-tag';
import { Mutation, Subscription } from 'react-apollo';
import { WebSocketLink } from 'apollo-link-ws'
import { split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { getMainDefinition } from 'apollo-utilities'

const wsLink = new WebSocketLink({
 uri: `ws://localhost:5000/`,
 options: {
  reconnect: true
 }
})

const httpLink = new HttpLink({
 uri: 'http://localhost:3000/graphql'
})

const link = split(
 ({ query }) => {
  const {kind, operation} = getMainDefinition(query)
  return kind === 'OperationDefinition' && operation === 'subscription'
 },
 wsLink,
 httpLink
)

const EMAIL_SUBSCRIPTION = gql `
 subscription onSendEmail($username: String $email: String!) {
  sendEmail(username: $username email: $email) {
   username,
   email
  }
 }
`
const subscribeHandler = ({ username, email}) => (
 <Subscription
  subscription={EMAIL_SUBSCRIPTION}
  variables={{ username, email}}
 >
 {({data: { sendEmail}, loading }) => 
 alert("An email has been sent")
}
 </Subscription>
);
const firebaseSignUp = gql`
	mutation firebaseSignUp($username: String!, $thirdPartyUID: String!, $email: String!) {
		firebaseSignUp(username: $username, thirdPartyUID: $thirdPartyUID, email: $email) {
			id
			username
			email
			thirdPartyUID
		}
	}
`;

const SignUpPage = () => {
	return (
		<div>
			<h1>Changing This</h1>
			<SignUpForm />
		</div>
	);
};
const INITIAL_STATE = {
	username: '',
	email: '',
	passwordOne: '',
	passwordTwo: '',
	error: null,
	uid: '',
};
class SignUpFormBase extends Component {
	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE };
	}
	onChangeHandler = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};
	render() {
		const { username, email, passwordOne, passwordTwo, error } = this.state;
		const isInvalid = passwordOne !== passwordTwo || passwordOne === '' || email === '' || username === '';
		return (
   <React.Fragment>
			<Mutation mutation={firebaseSignUp}>
				{(signUpMutation, { data }) => {
					return (
						<form
							onSubmit={(e) => {
								e.preventDefault();
								const { username, email, passwordOne } = this.state;
								const roles = [];
								this.props.firebase
									.doCreateUserWithEmailAndPassword(email, passwordOne)
									.then((authUser) => {
										console.log(authUser.user.uid, 'user uid');
										this.setState({ uid: authUser.user.uid });
										return this.props.firebase.user(authUser.user.uid).set(
											{
												username,
												email,
												roles,
											},
											{ merge: true },
										);
									})
									.then(() => {
										signUpMutation({
											variables: {
												username: this.state.username,
												thirdPartyUID: this.state.uid,
												email: this.state.email,
											},
										});
									})
									.then(() => {
										this.props.history.push(ROUTES.HOME);
									})
									.catch((err) => {
										// Made error codes/msg's strings until we set the value.
										if (err.code === 'ERROR_CODE_ACCOUNT_EXISTS') {
											err.message = 'ERROR_MSG_ACCOUNT_EXISTS';
										}

										this.setState({ err });
										// console.log(err);
									});
							}}>
							<input
								name='username'
								value={username}
								onChange={this.onChangeHandler}
								type='text'
								placeholder='Username'
							/>
							<input
								name='email'
								value={email}
								onChange={this.onChangeHandler}
								type='text'
								placeholder='Email Address'
							/>
							<input
								name='passwordOne'
								value={passwordOne}
								onChange={this.onChangeHandler}
								type='text'
								placeholder='Password'
							/>
							<input
								name='passwordTwo'
								value={passwordTwo}
								onChange={this.onChangeHandler}
								type='text'
								placeholder='Confirm password.'
							/>
							<button disabled={isInvalid} type='submit'>
								{' '}
								Sign Up
							</button>
							{error && <p>{error.message}</p>}
						</form>
					);
				}}
			</Mutation>
        <Subscription subscription={EMAIL_SUBSCRIPTION}>
    {(sendEmail, { data }) => {
     return (
      <React.Fragment>
      </React.Fragment>
     )
    }}
   </Subscription>
   </React.Fragment>
		);
	}
}
const SignUpLink = () => {
	return (
		<p>
			Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
		</p>
	);
};
const SignUpForm = compose(withRouter, withFirebase)(SignUpFormBase);
// Allow SignUpForm to use Firebase and Router via recompose.

export default SignUpPage;
export { SignUpForm, SignUpLink };
