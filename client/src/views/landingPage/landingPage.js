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
	}

	render() {
		return (
			<div>
				<SearchBar userClicked={this.state.userClicked} />
				<h1>Featured Projects</h1>
				<Query
					query={gql`
						{
							projects(orderBy: rating_DESC) {
								id
								name
								titleImg
								rating
								User
    								{
										id
      									username
										email  
    								}
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

							return newProjects.slice(0, 4);
						}	
						
						const projects = filteredProjects();

						return (
							<div className='card-container'>
								{projects.map(
									({ id, name, titleImg, rating, User }) => (
										<FeaturedAndMakers
											type="featured"
											key={id}
											image={titleImg}
											stars={rating}
											title={name}
											// below might need to be edited
											user={User}
										/>
									)
								)}
							</div>
						)
					}}
				</Query>
			
				<h1>Popular Makers</h1>
				<Query
					query={gql`
						{
							users(orderBy: username_ASC) {
								id
								username
								userProfileImage
								Projects {
      								rating
      								timestamp
    							}
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
				<Query
					query={gql`
						{
							users(orderBy: username_ASC) {
								id
								username
								userProfileImage
								ReviewList {
      								rating
      								timestamp
    							}
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
			</div>
		);
	}
}

export default LandingPage;
