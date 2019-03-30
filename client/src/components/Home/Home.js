import React, { Component } from 'react';
import SearchBar from './Searchbar/Searchbar';
import { Query, compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import {withAuthentication} from '../Session/session';

import Featured from './Featured/Featured';
import Header from './Header/Header';
import './Home.scss';


class Home extends Component {
	constructor() {
		super();
		this.state = {
			userClicked: null,
		};
	}

	//This handler adds the user clicked in Popular Reviewer and Popular maker to userClicked
	clickUserHandler = (username) => {
		this.setState({ userClicked: username });
	}

	filterByCurrentMonth = (data) => {
		const currentTime = new Date()

		var month = currentTime.getMonth() + 1
							
		var year = currentTime.getFullYear()

		const filteredData = data.map(item => {
			if (item.timestamp.slice(0, 4) == year && item.timestamp.slice(5, 7) == month) { 
				return item;
			}
		});

		return filteredData.filter(function(e){return e});
	}

	render() {
		
			const getUsers = gql`
				{
					users{
						id
						username
						userProfileImage
					}
				}
			`
			const getProjects = gql`
				{
					projects{
						id
						name
						titleImg
						category
						rating
					}
				}
			`
			const getReviews = gql`
				{
					reviews{
						id
						name
						text
						editedAt
						Author{
							id
							username
						}
						ProjectReviewed{
							id
							name
						}
					}
				}
			`

const SearchWithData = () => (
  <Query query={getUsers}>
    {({ loading: loadingUsers, data: userData }) => (
      <Query query={getProjects}>
        {({ loading: loadingProjects, data: projectData}) => (
					<Query query={getReviews}>
					{({ loading: loadingReviews, data: reviewData}) => {
						if (loadingUsers || loadingProjects || loadingReviews) return <span>loading...</span>
						const userArray = Object.values(userData).flat()
						const projectArray = Object.values(projectData).flat()
						const reviewArray = Object.values(reviewData).flat()
          	return (
							<SearchBar userClicked={this.state.userClicked} users={userArray} projects={projectArray} reviews={reviewArray}/>
						)	
					}}</Query>
          
				)}
      </Query>
    )}
  </Query>
);
		
		return (
			<div>
				<Header />
				{/* <Query
					query={}
				>
					{({ loading, error, data }) => {
						if (loading) return <p>Loading...</p>;
						if (error) return <p>Error :(</p>;
						return (
							<SearchBar userClicked={this.state.userClicked} users={data.users} />
						)	
					}}
				</Query> */}
				<SearchWithData />
				
				<div id='home-container'>
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
							
							const projects = this.filterByCurrentMonth(data.projects).slice(0, 4);

							return (
								<div className='card-container'>
									{projects.map(
										({ id, name, titleImg, rating, User }) => (
											<Featured
												key={id}
												image={titleImg}
												rating={rating}
												title={name}
												// below might need to be edited
												username={User.username}
												clickHandler={this.clickUserHandler}
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
							
							const currentMakers = data.users.map(user => {
								const currentProject = this.filterByCurrentMonth(user.Projects);

								if(currentProject.length === 0) {
									return null;
								}

								const rating = currentProject.map(project => {
									return project.rating;
								});

								///Checks for the mode average

								let frequency = {};  // array of frequency.
								let max = 0;  // holds the max frequency.
								let average;   // holds the max frequency element.
								for(let v in rating) {
        							frequency[rating[v]]=(frequency[rating[v]] || 0)+1; // increment frequency.
        							if(frequency[rating[v]] > max) { // is this frequency > max so far ?
                							max = frequency[rating[v]];  // update max.
                							average = rating[v];          // update result.
									}
								}

								return {
									"id": user.id,
									"username": user.username,
									"userProfileImage": user.userProfileImage,
									"averageRating": average
								}
							}).filter(e => (e!==undefined) && (e!==null));

							const sortedMakers = currentMakers.sort(function(a, b){return b.averageRating - a.averageRating}).slice(0, 8);

							return (
								<div className='card-container'>
									{sortedMakers.map(
										({ id, username, userProfileImage, averageRating }) => (
											<Featured
												key={id}
												username={username}
												image={userProfileImage}
												clickHandler={this.clickUserHandler}
												rating={averageRating}
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
											<Featured
												key={id}
												username={username}
												image={userProfileImage}
												clickHandler={this.clickUserHandler}
											/>
										)
									)}
								</div>
							)
						}}
					</Query>	
				</div>
			</div>
		);
	}
}

export default withAuthentication (Home);
