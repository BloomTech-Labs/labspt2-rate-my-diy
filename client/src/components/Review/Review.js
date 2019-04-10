import React, { Component } from 'react';
import { getReviews } from '../../query/query.js';
import {Query} from 'react-apollo';
import gql from 'graphql-tag'
class Review extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

  render() {
    const Reviews = ({ Review }) => (
      <Query query={getReviews}>
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;
          
            const id = this.props.match.params;
            console.log(id);

            const currentReview = data.reviews.filter(review => {
              return review.id === id;
            })
            console.log(currentReview, 'current Review')
          return (
            <React.Fragment>
              <h1 className='headerReview'>Reviews</h1>
              <div className='card-container'>
                {data.reviews.map(({ id, text, name, timestamp, Author, ProjectReviewed }) => (
                  <div key={id} className={'review-card'} to={`/reviews/${id}`}>
                    <div>
                      <p className='review-name'>Reviewer: {`${Author.username} `}</p>
                      <h2 className='project-name'>Project: {`${ProjectReviewed.name}`}</h2>
                      <img alt={'project'} className='review-img' src={`${ProjectReviewed.titleImg}`} />

                      <p className='review-text'>Text: {`${text}`}</p>
                      <p className='project-extra'>{`${name}`}</p>
                    </div>
                  </div>
                ))}
              </div>
            </React.Fragment>
          );
        }}
      </Query>
    );

    return (
      <div>
        <Reviews />
      </div>
    );
  }
}


export default Review;
