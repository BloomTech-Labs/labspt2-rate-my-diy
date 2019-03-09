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

import React from 'react';

class SearchBar extends Component {
	constructor() {
		this.state = {
			text: ' search'
		};
	}
	render() {
		return (
			<div className="searchbar">
				<input
					type="text"
					onChange="kj"
					placeholder={`&#x1f50d; ${this.state.text}`}
				/>
				<button className="search">Search</button>
			</div>
		);
	}
}

export default searchBar;
