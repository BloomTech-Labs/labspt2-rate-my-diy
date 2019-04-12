import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import './Review.scss';

const GET_SPECIFIC_PROJECT = gql`
	query review($id: ID!) {
		project(where: { id: $id }) {
			name
			text
			timestamp
			ProjectReviewed {
				name
				category
				titleImg
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
    this.setState({id:id})
  }

  render() {
    const slicedArray = this.state.reviews.slice();
    console.log(slicedArray['0'], 'first review in array ');
    console.log(this.state.reviews, 'reviews array');
    const id = this.props.match.params;

    Review = () => (
      <Query query={GET_SPECIFIC_PROJECT} variables={id}>
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;
          console.log('data from query', data);
          return (
           <div>
           
           </div>
          );
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

export default Project
