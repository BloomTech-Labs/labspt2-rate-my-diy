import React, { Component } from 'react';
import Nav from './components/nav/nav';
import SearchBar from './components/searchbar/searchbar.js';
import Footer from './components/footer/footer';

class App extends Component {
	render() {
		return (
			<div className="App">
				<Nav />
				<Footer />
				<SearchBar />
				<div className="App">
					<Nav />
					<Footer />
				</div>
			</div>
		);
	}
}

export default App;
