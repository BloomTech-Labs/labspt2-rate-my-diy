import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import * as math from 'mathjs';
import ReviewCard from '../ReviewCard/ReviewCard';
import Featured from '../Home/Featured/Featured';
import './Profile.scss';
import ProjectCard from '../ProjectCard/ProjectCard';
const GET_USERS = gql`
	{
		users {
			id
			username
			userProfileImage
			email
			bio
			accountType
			ReviewList {
				id
				name
				text
				timestamp
				thumbsUp
				thumbsDown
				projRating
				Author {
					id
					username
					email
				}
				ProjectReviewed {
					id
					name
					timestamp
					titleImg
					titleBlurb
					rating
					User {
						id
						username
					}
				}
			}
			Projects {
				id
				name
				timestamp
				titleImg
				titleBlurb
				rating
				steps
				User {
					id
					username
					email
				}
			}
			LikedReviews {
				id
				name
				text
				timestamp
				thumbsDown
				thumbsUp
				projRating
				Author {
					id
					username
					email
				}
				ProjectReviewed {
					id
					name
					timestamp
					titleImg
					titleBlurb
					rating
					User {
						id
						username
					}
				}
			}
			DislikedReviews {
				id
				name
				text
				timestamp
				thumbsUp
				thumbsDown
				projRating
				Author {
					id
					username
					email
				}
				ProjectReviewed {
					id
					name
					timestamp
					titleImg
					titleBlurb
					rating
					User {
						id
						username
					}
				}
			}
			RatedProjects {
				id
				name
				timestamp
				titleImg
				titleBlurb
				rating
				steps
				User {
					id
					username
				}
			}
		}
	}
`;
const GET_USER = gql`
	query user($email: String!) {
		user(where: { email: $email }) {
			id
			username
			userProfileImage
			email
			bio
			accountType
			ReviewList {
				id
				name
				text
				timestamp
				thumbsUp
				thumbsDown
				projRating
				Author {
					id
					username
					email
				}
				ProjectReviewed {
					id
					name
					timestamp
					titleImg
					titleBlurb
					rating
					User {
						id
						username
					}
				}
			}
			Projects {
				id
				name
				timestamp
				titleImg
				titleBlurb
				rating
				steps
				User {
					id
					username
					email
				}
			}
			LikedReviews {
				id
				name
				text
				timestamp
				thumbsDown
				thumbsUp
				projRating
				Author {
					id
					username
					email
				}
				ProjectReviewed {
					id
					name
					timestamp
					titleImg
					titleBlurb
					rating
					User {
						id
						username
					}
				}
			}
			DislikedReviews {
				id
				name
				text
				timestamp
				thumbsDown
				thumbsUp
				projRating
				Author {
					id
					username
					email
				}
				ProjectReviewed {
					id
					name
					timestamp
					titleImg
					titleBlurb
					rating
					User {
						id
						username
					}
				}
			}
			RatedProjects {
				id
				name
				timestamp
				titleImg
				titleBlurb
				rating
				steps
				User {
					id
					username
				}
			}
		}
	}
`;

class Profile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: null,
		};
	}
	clickUserHandler = (username) => {
		this.setState({ userClicked: username });
	};
	render() {
		let email = this.props.email;
		const UserWithData = () => (
			<Query query={GET_USER} variables={{ email: email }}>
				{({ loading: userLoading, data: userData, error: userError, refetch: userRefetch }) => (
					<Query query={GET_USERS}>
						{({ loading: usersLoading, data: usersData, error: usersError, refetch: usersRefetch }) => {
							if (userLoading || usersLoading) return <span>Loading...</span>;
							if (userError || usersError) return <span>{`Error: ${userError || usersError}`}</span>;

							if (userData !== undefined) userData = Object.values(userData).flat();
							const user = userData[0];
							if (usersData !== undefined) usersData = Object.values(usersData).flat();
							const users = usersData;
							const {
								username,
								userProfileImage,
								bio,
								ReviewList,
								Projects,
								LikedReviews,
								DislikedReviews,
								RatedProjects,
							} = user;

							return (
								<React.Fragment>
									<div className='profile-container'>
										<div className='profile-info'>
											<div className='profile-user-content'>
												<h1>{`${username}`}</h1>
												<img className='profile-img' src={userProfileImage} alt='profile' />
												<p>{`${bio}`}</p>
											</div>
											{ReviewList.length > 1 ? <h2>{`${username}'s Reviews`}</h2> : null}

											<div className='project-profile-container'>
												{ReviewList.map((review) => {
													return (
														<ReviewCard
															key={review.id}
															review={review}
															users={users}
															user={user}
															refetch={usersRefetch}
														/>
													);
												})}
											</div>
										</div>
										{Projects.length > 1 ? <h2>{`${username}'s Projects`}</h2> : null}

										<div className='profile-projects'>
											{Projects.map((project) => {
												let meanRating = project.rating;
												if (project.rating.length > 1)
													meanRating = parseFloat(math.mean(project.rating.slice(1)).toFixed(2));
												if (project.rating.length === 1) meanRating = parseFloat(math.mean(project.rating).toFixed(2));

												project.rating = meanRating;
												return (
													<div className='profile-project-card' key={project.id}>
														<Featured
															id={project.id}
															image={project.titleImg}
															rating={meanRating}
															title={project.name}
															username={project.User.username}
															clickHandler={this.clickUserHandler}
														/>
													</div>
												);
											})}
										</div>
										{LikedReviews.length > 1 ? <h2>{`Reviews Liked By ${username}`}</h2> : null}

										<hr className='line-break' />
										<div className='profileReviewContainer'>
											{LikedReviews.map((review) => {
												return (
													<div className='rated-card-container'>
														<div className='inner-rated-card'>
															<ReviewCard
																key={review.id}
																review={review}
																users={users}
																user={user}
																refetch={usersRefetch}
															/>
														</div>
													</div>
												);
											})}
										</div>
										{DislikedReviews.length > 1 ? <h2>{`Reviews Disliked By ${username}`}</h2> : null}
										<div className='profileReviewContainer'>
											{DislikedReviews.map((review) => {
												return (
													<div className='rated-card-container'>
														<div className='inner-rated-card'>
															<ReviewCard
																key={review.id}
																review={review}
																users={users}
																user={user}
																refetch={usersRefetch}
															/>
														</div>
													</div>
												);
											})}
										</div>
										{RatedProjects.length > 1 ? <h2>{`Projects Rated By ${username}`}</h2> : null}

										<div className='project-profile-container'>
											{RatedProjects.map((project) => {
												let meanRating = project.rating;
												if (project.rating.length > 1)
													meanRating = parseFloat(math.mean(project.rating.slice(1)).toFixed(2));
												if (project.rating.length === 1) meanRating = parseFloat(math.mean(project.rating).toFixed(2));

												project.rating = meanRating;
												return (
													<Featured
														id={project.id}
														image={project.titleImg}
														rating={meanRating}
														title={project.name}
														username={project.User.username}
														clickHandler={this.clickUserHandler}
													/>
												);
											})}
										</div>
									</div>
								</React.Fragment>
							);
						}}
					</Query>
				)}
			</Query>
		);
		return <UserWithData />;
	}
}

export default Profile;
