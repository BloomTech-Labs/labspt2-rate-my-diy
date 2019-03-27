import React, { Component } from 'react';
import categoryBar from '../../components/categoryBar/categoryBar';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import FeaturedAndMakers from '../../components/featureProject/featureProject.js';
import './searchPage.scss';


class SearchPage extends Component {
	constructor() {
		super();
		this.state = {
            maker: "",
            reviewer: "",
            category: "",
            stars: "",
            filterBy: "",
            sortBy: ""
		};
	}
	

	render() {
		return (
			<div>
				<categoryBar />
				<h1>Results</h1>
			</div>
		);
	}
}

export default SearchPage;