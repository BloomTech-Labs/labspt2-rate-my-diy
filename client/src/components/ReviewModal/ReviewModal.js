import './ReviewModal.scss';
import { Query } from 'react-apollo';
import React, { Component } from 'react';
import { getReviews } from '../../query/query';
import { Link } from 'react-router-dom'
class ReviewModal extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	onReviewSelected = (review) => {};

	// render() {
	//  return (
	//   <div>
	//    const Reviews = ({ Review }) => ({
	//     <Query query={GET_REVIEWS}>
	//      {({ loading, error, data }) => {
	//      if (loading) return "Loading...";
	//      if (error) return `Error! ${error.message}`;
	//      console.log(data);

	//      return (

	//      <div>

	//      </div>
	//     );
	//      }}
	//     </Query>
	//    })
	//   </div>
	//  )}

	render() {
		const Reviews = ({ Review }) => (
			<Query query={getReviews}>
				{({ loading, error, data }) => {
					if (loading) return <p>Loading...</p>;
					if (error) return <p>Error :(</p>;

					return (
						<React.Fragment>
							<h1 className='headerReview'>Reviews</h1>
							<div className='card-container'>
								{data.reviews.map(({ id, text, name, timestamp, Author, ProjectReviewed }) =>
									`${console.log(ProjectReviewed)}`(
										<div key={id} className='review-card'>
											<p className='review-name'>Reviewer: {`${Author.username} `}</p>
											<h2 className='project-name'>Project: {`${ProjectReviewed.name}`}</h2>
											<img alt={'project'} className='review-img' src={`${ProjectReviewed.titleImg}`} />

											<p className='review-text'>Text: {`${text}`}</p>
											<p className='project-extra'>{`${name}`}</p>
										</div>,
									),
								)}
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

export default ReviewModal;
