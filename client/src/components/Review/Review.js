import React, { Component } from 'react';
import { getReviews } from '../../query/query.js';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import "./Review.scss"
const GET_SPECIFIC_REVIEW = gql`
	query review($id: ID!) {
		review(where: { id: $id }) {
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
class Review extends Component {
	constructor(props) {
		super(props);

		this.state = {
			reviews: '',
			review: '',
			id: '',
		};
	}
	reviewFinder = (id) => {
		const reviews = this.state.reviews;
		// console.log(reviews["0"].id, 'reviews inside function')
		// const actualReview=reviews.filter(review => review.ProjectReviewed.id === id);
		// console.log(actualReview, 'this is probably it')
	};

	componentDidMount() {
		const id = this.props.match.params;
		this.setState({ id: id });
		this.reviewFinder(this.state.id);
	}

	render() {
		const slicedArray = this.state.reviews.slice();
		console.log(slicedArray['0'], 'first review in array ');
		console.log(this.state.reviews, 'reviews array');
		const id = this.props.match.params;

		Review = () => (
			<Query query={GET_SPECIFIC_REVIEW} variables={id}>
				{({ loading, error, data }) => {
					if (loading) return <p>Loading...</p>;
					if (error) return <p>Error :(</p>;
					console.log('data from query', data);

					return (
						<React.Fragment>
							<h1 className='headerReview'>Review</h1>
       <div className="single-review-card">
       <p>
       {data.review.ProjectReviewed.name}
       </p>
       <span>

       {data.review.ProjectReviewed.category}
       </span>
       <img alt="project" className="review-img" src={data.review.ProjectReviewed.titleImg}/>
       {data.review.name}
       {data.review.text}
       </div>
							<div className='card-container' />
						</React.Fragment>
					);
				}}
			</Query>
		);

		return (
			<div>
				<Review />
			</div>
		);
	}
}

export default Review;
