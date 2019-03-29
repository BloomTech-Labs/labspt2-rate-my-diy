/* 
1. User Gets Redirected To This Page If They Aren't a New User.
2. Pass email, username, back to fireBase.
3. .then() call the netlify function to run nodemailer
4. .then() send the users info to Prisma 
*/
import React, { Component } from 'react';

class AdditionInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			username: '',
			uid: '',
		};
	}
	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	};

	onSubmit = (e) => {};

	render() {
		const { email, username } = this.state;
		return (
			<React.Fragment>
				<h1>Complete Your Sign Up.</h1>
				<form onSubmit={this.onSubmit}>
					<input onChange={this.onChange} name='email' value={email}>
						Email Address
					</input>
					<input onChange={this.onChange} name='username' value={username}>
						Username
					</input>
					<button type='submit' />
				</form>
			</React.Fragment>
		);
	}
}

export default AdditionInfo;
