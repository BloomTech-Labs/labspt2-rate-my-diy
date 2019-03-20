import React, { Component } from 'react';
import axios from 'axios';

import SearchBar from '../../components/searchbar/searchbar.js';
import FeaturedAndMakers from '../../components/featureProject/featureProject.js';
import PopularReviewerCard from '../../components/popularReviewers/popularReviewers.js';
import './landingPage.scss';
import { throws } from 'assert';

{/* <div className='card-container'>
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
				</div> */}

class LandingPage extends Component {
	constructor() {
		super();
		this.state = {
			userClicked: null,
			projects: []
		};
	}

	componentDidMount() {
		this.sortProjectsByRating();
	}
	
	//This handler adds the user clicked in Popular Reviewer and Popular maker to userClicked
	clickUserHandler = (username) => {
		this.setState({ userClicked: username });
	}

	sortProjectsByRating = () => {
		const currentTime = new Date()

		const year = currentTime.getFullYear()

		const month = ("0" + (currentTime.getMonth() + 1)).slice(-2)

		axios.get(`http://localhost:5000/api/v1/projects/current/${year}-${month}`)
			.then(res => {
				this.setState({
					projects: res.data.sort(function(a, b){return b.rating - a.rating})
				});
			})
			.catch(err => {
				console.log(err);
			});
	}

	/* 
	
						//This function filters the projects in the current month and year and returns the 4 with the highest rating	
						const filteredProjects = () => {
							
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
					{this.state.projects.map(
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
				
				
			</div>
		);
	}
}

export default LandingPage;
