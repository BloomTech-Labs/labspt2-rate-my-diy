import React, { Component } from 'react';
import { getReviews } from '../../query/query.js';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

var reviewArray = []
class Review extends Component {
	constructor(props) {
		super(props);

		this.state = {
   reviews: reviewArray
  };
 }
 

	render() {
  console.log(this.state.reviews)
  Review = ({ Review }) => (
   <Query query={getReviews}>
    {({ loading, error, data }) => {
     if (loading) return <p>Loading...</p>;
     if (error) return <p>Error :(</p>;
 
     const id = this.props.match.params;
     const length = data.reviews.length, i = 0;
     
      for (let i = 0; i < data.reviews.length; i++) {
       reviewArray.push(data.reviews[i])
      }
     console.log(data.reviews[0], 'targeted review');
     console.log(id, 'id');
     // const currentReview = data.reviews.find((review) => {
     // 	return review.id === id;
     // });
      data.reviews.filter(review => {
      if (review.id === id){
       return review 
      }
      })
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
    <Review/>
			</div>
		);
	}
}

export default Review;
