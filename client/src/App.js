import React, { Component } from 'react';
import Nav from './components/nav/nav';
import Footer from './components/footer/footer';
import ExampleQuery from './examples/exampleQuery';
import LandingPage from './views/landingPage/landingPage.js';

class App extends Component {
	render() {
		return (
			<div className="App">
				<Nav />
				<LandingPage />
				<Footer />
			</div>
		);
	}
}

export default App;
