import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {compose} from 'recompose';

import {SignUpLink} from '../signUp/signUp';
import {withFirebase} from '../firebase/firebase';
import * as ROUTES from '../../reactRouter/reactRouter';

export default function signIn() {
	return (
		<div>
			<h1>Sign In Page</h1>
		</div>
	);
}
