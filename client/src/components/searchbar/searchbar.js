//todo:
//control searchbar component
//make isLoggedIn state
//make onClick for submit button
//onClick should check isLoggedIn
//if not logged in, display pop-up
//pop-up should have dummy log in button
// pop-up should have functional dismiss button
//move on to o auth implementation
//wire logged in state to larger app using react context

import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './searchbar.scss';

class SearchBar extends Component {
	constructor() {
		super();
		this.state = {
			text: ' search'
		};
	}
	render() {
		return (
			<div className="searchbar">
				<span>
					<FontAwesomeIcon icon={faSearch} />
					<input type="text" onChange="kj" placeholder={this.state.text} />
				</span>

				<button className="search">Search</button>
			</div>
		);
	}
}

export default SearchBar;
