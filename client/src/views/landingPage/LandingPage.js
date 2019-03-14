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
		this.state = {
			userClicked: null
		};
	}
	
	//This handler adds the user clicked in Popular Reviewer and Popular maker to userClicked
	clickUserHandler = (username) => {
		this.setState({ userClicked: username });
		console.log(this.state.userClicked);
	}

	render() {
		return (
			<div>
				<SearchBar userClicked={this.state.userClicked} />
				<h1>Featured Projects</h1>
				{/* featured project query */}
				<Query
					query={gql`
						{
							projects(orderBy: timestamp_DESC) {
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
					{({ loading, error, data }) => {
						if (loading) return <p>Loading...</p>;
						if (error) return <p>Error :(</p>;
						
						//This function filters the projects in the current month and year and returns the 4 with the highest rating	
						const filteredProjects = () => {
							const currentTime = new Date()

							var month = currentTime.getMonth() + 1
						
							var year = currentTime.getFullYear()

							const newProjects = [];

							data.projects.map(project => {
								if (project.timestamp.slice(0, 4) == year && project.timestamp.slice(5, 7) == month) { 
									newProjects.push(project);
								}
							});

							const sortedByRating = newProjects.sort(function(a, b){return b.rating - a.rating});

							return sortedByRating.slice(0, 4);
						}	
						
						const projects = filteredProjects();

						return (
							<div className='card-container'>
								{projects.map(
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
				<Query
					query={gql`
						{
							users(orderBy: username_ASC) {
								id
								username
								userProfileImage
							}
						}
					`}
				>
					{({ loading, error, data }) => {
						if (loading) return <p>Loading...</p>;
						if (error) return <p>Error :(</p>;

						return (
							<div className='card-container'>
								{data.users.map(
									({ id, username, userProfileImage }) => (
										<PopularReviewerCard
											type="featured"
											key={id}
											username={username}
											userProfileImage={userProfileImage}
											clickHandler={this.clickUserHandler}
										/>
									)
								)}
							</div>
						)
					}}
				</Query>
				<h1>Popular Reviewers</h1>
				{/* popular reviewers query */}
				<Query
					query={gql`
						{
							users(orderBy: username_ASC) {
								id
								username
								userProfileImage
							}
						}
					`}
				>
					{({ loading, error, data }) => {
						if (loading) return <p>Loading...</p>;
						if (error) return <p>Error :(</p>;

						return (
							<div className='card-container'>
								{data.users.map(
									({ id, username, userProfileImage }) => (
										<PopularReviewerCard
											type="featured"
											key={id}
											username={username}
											userProfileImage={userProfileImage}
										/>
									)
								)}
							</div>
						)
					}}
				</Query>	
			</div>
		);
	}
}

export default LandingPage;
