//todo:
//featured projects

//back as well

//How to determine which to display??

//popular makers

//popular reviewers

//remove searchbar from app, put it here instead

//connect to app state

//make popup dismissible

//figure out how to query api

//make search results route to a search result page (both an api call and a react route)

//conditionally display sign up and log in buttons

//conditionally turn sign up and log in buttons into a hamburger button (links in trello)

//Clicking a `Makers` card will redirect the user to the search page _with_ search
//    fields on the search field pre-populated with the maker entered into the necessary fields

//Clicking a `Popular Reviewers` card will redirect the user to the search page _with_ the reviewer field populated with that reviewer's name.

//conditionally render ability to share project and rate projects

//recheck wireframe

//make and run tests?

//stretch- make functional 'sliding' display for UI cards

import React, { Component } from 'react';
import SearchBar from '../../components/searchbar/searchbar.js';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import FeaturedAndMakers from '../../components/featureProject/featureProject.js';
import PopularReviewerCard from '../../components/popularReviewers/popularReviewers.js';
import './landingPage.scss';

class LandingPage extends Component {
	constructor() {
		super();
		this.state = {};
	}
	render() {
		return (
			<div>
				<SearchBar />
				<h1>Featured Projects</h1>
				{/* featured project query */}
				<Query
					query={gql`
						{
							projects(orderBy: timestamp_DESC, first: 2) {
								id
								name
								titleImg
								rating
								authorName
								timestamp
							}
						}
					`}
				>
					{/*timestamp may have error, hopefully will be resolved with switch to timestamps */}
					{({ loading, error, data }) => {
						if (loading) return <p>Loading...</p>;
						if (error) return <p>Error :(</p>;

						return (
							<div className='card-container'>
								{data.projects.map(
									({ id, name, titleImg, rating, authorName }) => (
										<FeaturedAndMakers
											type="featured"
											key={id}
											image={titleImg}
											stars={rating}
											title={name}
											// below might need to be edited
											user={authorName}
										/>
									)
								)}
							</div>
						)
					}}
				</Query>
			
				<h1>Popular Makers</h1>
				{/* popular makers query */}

				<FeaturedAndMakers />
				<h1>Popular Reviewers</h1>
				{/* popular reviewers query */}

				<PopularReviewerCard />
			</div>
		);
	}
}

export default LandingPage;
