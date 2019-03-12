import React, { Component } from 'react';
import Nav from './components/nav/nav';
import SearchBar from './components/searchbar/searchbar.js';
import Footer from './components/footer/footer';
import ExampleQuery from './examples/exampleQuery';

class App extends Component {
	render() {
		return (
			<div className="App">
				<Nav />
        <ExampleQuery />
				<Footer />
				<SearchBar />
				<Footer />
     </div>
		);
	}
}

export default App;
