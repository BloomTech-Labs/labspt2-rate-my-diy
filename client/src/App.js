import React, { Component } from 'react';
import Nav from './components/nav/nav';
import Footer from './components/footer/footer';

class App extends Component {
	render() {
		return (
			<div className="App">
				<Nav />
				<Footer />

				<div className="App" />
			</div>
		);
	}
}

export default App;
