import React, { Component } from 'react';
import { getReviews } from '../../query/query.js';
class Review extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	render() {
		console.log(this.props, 'review state');
		console.log(getReviews);
		return (
			<div>
				<h1>Hello World</h1>
			</div>
		);
	}
}

export default Review;
