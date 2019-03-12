import React, { Component } from 'react';
import Nav from './components/nav/nav';
import Footer from './components/footer/footer';
import { Query } from "react-apollo";
import gql from "graphql-tag";

class App extends Component {
	render() {
		return (
			<div className='App'>
				<Nav />
				<Footer />

				<Query
					query={gql `
						{
							users(orderBy: username_ASC)
  								{
									id  
    								username
    								email
  								}	
						}
					`}
				>
				{({ loading, error, data }) => {
					if(loading) return <p>Loading...</p>
					if(error) return <p>Error :(</p>
					
					return data.users.map(({id, username, email}) => (
						<div key={id}>
							<p>{username}</p>
							<p>{email}</p>
						</div>
					));
				}}
				</Query>
			</div>
		);
	}
}

export default App;
