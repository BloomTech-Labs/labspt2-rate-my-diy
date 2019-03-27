import React, { Component } from 'react';
import { withAuthorization } from '../Session/session';

class Account extends Component {
	render() {
		return (
			<div>
				<h3>Protected Page If Not Authenticated</h3>
			</div>
		);
	}
}
const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(Account);
