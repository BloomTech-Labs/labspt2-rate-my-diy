import React, { Component } from 'react';
import SearchBar from '../../components/searchbar/searchbar.js';

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
	}

	/* 
	
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
						
						//const projects = filteredProjects();	
	
	*/

	render() {
		return (
			<div>
				<SearchBar userClicked={this.state.userClicked} />
				<h1>Featured Projects</h1>
				{/* featured project query */}
				
						
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
				
			
				<h1>Popular Makers</h1>
				{/* popular makers query */}
				
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
				<h1>Popular Reviewers</h1>
				{/* popular reviewers query */}
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
			</div>
		);
	}
}

export default LandingPage;
