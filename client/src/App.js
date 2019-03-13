import React, { Component } from 'react';
import Nav from './components/nav/nav';
import Footer from './components/footer/footer';
import ExampleQuery from './examples/exampleQuery';

class App extends Component {
	render() {
		return (
			<div className="App">
				<Nav />
				<SearchBar />
				<ExampleQuery />
				<Footer />
			</div>
		);
	}
}

export default App;
