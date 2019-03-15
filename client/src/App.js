import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navigation from './reactRouter/reactRouter'

class App extends Component {
	render() {
		return (
			<Router>
				<Navigation />
			</Router>
		);
	}
}

// please update your components and Routes as needed

export default App;
