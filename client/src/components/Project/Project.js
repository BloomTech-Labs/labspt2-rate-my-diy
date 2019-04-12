import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import './Project.scss';

const GET_SPECIFIC_PROJECT = gql`
 
  query project($id: ID!) {
		project(where: { id: $id }) {
    id
    name
    key
    category
    timestamp
    titleImg
    titleBlurb
    rating
    steps
    User {
      id
      username
    }
  }
}


`;
class Project extends Component {
	constructor(props) {
		super(props);

		this.state = {
			reviews: '',
			review: '',
			id: '',
		};
	}
	componentDidMount() {
		const id = this.props.match.params;
		this.setState({ id: id });
	}

	render() {
		const id = this.props.match.params;

		Project = () => (
			<Query query={GET_SPECIFIC_PROJECT} variables={id}>
				{({ loading, error, data }) => {
					if (loading) return <p>Loading...</p>;
					if (error) return <p>Error :(</p>;
					console.log('data from query', data);
					return <div />;
				}}
			</Query>
		);

		return (
			<div>
				<Project />
			</div>
		);
	}
}

export default Project;
