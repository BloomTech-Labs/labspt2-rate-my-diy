import React, { Component } from 'react';
import SearchBar from '../Searchbar/Searchbar';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { withAuthentication } from '../Session/session';
import * as math from 'mathjs';
import Featured from './Featured/Featured';
import './Home.scss';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userClicked: null,
      isLoggedIn: false,
      user: ''
    };
  }

  componentWillMount() {
    let user = this.props.firebase.auth.currentUser !== null;
    if (user) {
      this.setState({ isLoggedIn: true, user: user });
    } else {
      this.setState({ isLoggedIn: false });
    }
  }

  componentWillReceiveProps(nextProps) {
    let user = nextProps.firebase.auth.currentUser !== null;
    if (user) {
      this.setState({ isLoggedIn: true, user: user });
    } else {
      this.setState({ isLoggedIn: false, user: '' });
    }
  }

  //This handler adds the user clicked in Popular Reviewer and Popular maker to userClicked
  clickUserHandler = (username) => {
    this.setState({ userClicked: username });
  };

  filterByCurrentMonth = (data) => {
    const currentTime = new Date();

    const month = currentTime.getMonth();

    const year = currentTime.getFullYear();

    const filteredData = data.map((item) => {
      if (
        // eslint-disable-next-line
        item.timestamp.slice(0, 4) == year &&
        // eslint-disable-next-line
        item.timestamp.slice(5, 7) == month
      ) {
        return item;
      }
      return null;
    });

    return filteredData.filter(function(e) {
      return e;
    });
  };

  filterByCurrentMonthReviews = (data) => {
    const currentTime = new Date();

    const month = currentTime.getMonth() + 1;

    const year = currentTime.getFullYear();

    //We clean the data we got to get over by taking out users that have no reviews
    const eliminateEmptyReviews = data.filter((item) => {
      if (item.ReviewList[0] !== undefined) {
        return item;
      }
      return null;
    });

    const popularReviewer = [];

    for (let i = 0; i < eliminateEmptyReviews.length; i++) {
      //We get the reviews that are from the current month
      let currentReviews = eliminateEmptyReviews[i].ReviewList.filter(
        (review) => {
          if (
            // eslint-disable-next-line
            review.timestamp.slice(0, 4) == year &&
            // eslint-disable-next-line
            review.timestamp.slice(5, 7) == month
          ) {
            return review;
          }
          return null;
        }
      );

      /* 
        This one is really good. We mutate the review list object array with the new array that has 
        the reviews with the current date and replace the old with the new.
      */

      eliminateEmptyReviews[i].ReviewList = currentReviews;

      //This block of code just grabs the thumbs up total of the reviews and returns just that
      let thumbsUpTotal = 0;

      eliminateEmptyReviews[i].ReviewList.map((review) => {
        return (thumbsUpTotal += review.thumbsUp);
      });

      //A way to sanitize our reviews because if a reviewer is not liked I'm sorry buddy you are not popular period
      if (thumbsUpTotal !== 0) {
        popularReviewer.push({
          id: eliminateEmptyReviews[i].id,
          username: eliminateEmptyReviews[i].username,
          email: eliminateEmptyReviews[i].email,
          userProfileImage: eliminateEmptyReviews[i].userProfileImage,
          thumbsUpTotal
        });
      }
    }
    return popularReviewer.sort((a, b) => b.thumbsUpTotal - a.thumbsUpTotal);
  };

  render() {
    const SearchWithData = () => (
      <Query query={this.props.getUsers}>
        {({ loading: loadingUsers, data: userData, error: userError }) => (
          <Query query={this.props.getProjects}>
            {({
              loading: loadingProjects,
              data: projectData,
              error: projectError
            }) => (
              <Query query={this.props.getReviews}>
                {({
                  loading: loadingReviews,
                  data: reviewData,
                  error: reviewError
                }) => {
                  if (loadingUsers || loadingProjects || loadingReviews)
                    return <span>loading...</span>;
                  if (userError) {
                    console.log({ userError: userError });
                    return null;
                  }
                  if (projectError) {
                    console.log({ projectError: projectError });
                    return null;
                  }
                  if (reviewError) {
                    console.log({ reviewError: reviewError });
                    return null;
                  }
                  let userArray = [];
                  let projectArray = [];
                  let reviewArray = [];

                  if (userData !== undefined)
                    userArray = Object.values(userData).flat();

                  if (projectData !== undefined)
                    projectArray = Object.values(projectData).flat();
                  projectArray = projectArray.map((project) => {
                    if (project.rating.length > 1) {
                      return (project = {
                        ...project,
                        rating: parseFloat(
                          math.mean(project.rating.slice(1)).toFixed(2)
                        )
                      });
                    } else {
                      return (project = {
                        ...project,
                        rating: parseFloat(math.mean(project.rating).toFixed(2))
                      });
                    }
                  });

                  if (reviewData !== undefined)
                    reviewArray = Object.values(reviewData).flat();
                  return (
                    <SearchBar
                      {...this.props}
                      userClicked={this.state.userClicked}
                      user={this.state.user}
                      loggedIn={this.state.isLoggedIn}
                      users={userArray}
                      projects={projectArray}
                      reviews={reviewArray}
                      projectSearchHandler={this.props.projectSearchHandler}
                      userSearchHandler={this.props.userSearchHandler}
                      reviewSearchHandler={this.props.reviewSearchHandler}
                    />
                  );
                }}
              </Query>
            )}
          </Query>
        )}
      </Query>
    );

    return (
      <div>
        <SearchWithData />

        <div id="home-container">
          <h2>Featured Projects</h2>
          <Query
            query={gql`
              {
                projects {
                  id
                  name
                  titleImg
                  rating
                  User {
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
              if (error) return <p>{`${error}`}</p>;
              let projectArray = data.projects.map((project) => {
                if (project.rating.length > 1) {
                  return (project = {
                    ...project,
                    rating: parseFloat(
                      math.mean(project.rating.slice(1)).toFixed(2)
                    )
                  });
                } else {
                  return (project = {
                    ...project,
                    rating: parseFloat(math.mean(project.rating).toFixed(2))
                  });
                }
              });
              const projects = this.filterByCurrentMonth(projectArray)
                .slice(0, 4)
                .sort(function(a, b) {
                  return b.rating - a.rating;
                });

              return (
                <div className="card-container">
                  {projects.map(({ id, name, titleImg, rating, User }) => {
                    let meanRating = rating;
                    if (rating.length > 1)
                      meanRating = parseFloat(
                        math.mean(rating.slice(1)).toFixed(2)
                      );
                    if (rating.length === 1)
                      meanRating = parseFloat(math.mean(rating).toFixed(2));
                    return (
                      <Featured
                        key={id}
                        image={titleImg}
                        rating={meanRating}
                        title={name}
                        username={User.username}
                        clickHandler={this.clickUserHandler}
                      />
                    );
                  })}
                </div>
              );
            }}
          </Query>

          <h2>Popular Makers</h2>
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

              const currentMakers = data.users
                .map((user) => {
                  const currentProject = this.filterByCurrentMonth(
                    user.Projects
                  );

                  if (currentProject.length === 0) {
                    return null;
                  }

                  const rating = currentProject.map((project) => {
                    let meanRating = project.rating;
                    if (project.rating.length > 1)
                      meanRating = parseFloat(
                        math.mean(project.rating.slice(1)).toFixed(2)
                      );
                    if (project.rating.length === 1)
                      meanRating = parseFloat(
                        math.mean(project.rating).toFixed(2)
                      );

                    return meanRating;
                  });

                  ///Checks for the mode average

                  let frequency = {}; // array of frequency.
                  let max = 0; // holds the max frequency.
                  let average; // holds the max frequency element.
                  for (let v in rating) {
                    frequency[rating[v]] = (frequency[rating[v]] || 0) + 1; // increment frequency.
                    if (frequency[rating[v]] > max) {
                      // is this frequency > max so far ?
                      max = frequency[rating[v]]; // update max.
                      average = rating[v]; // update result.
                    }
                  }

                  return {
                    id: user.id,
                    username: user.username,
                    userProfileImage: user.userProfileImage,
                    averageRating: average
                  };
                })
                .filter((e) => e !== undefined && e !== null);

              const sortedMakers = currentMakers
                .sort(function(a, b) {
                  return b.averageRating - a.averageRating;
                })
                .slice(0, 8);

              return (
                <div className="card-container">
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
              );
            }}
          </Query>
          <h2>Popular Reviewers</h2>
          <Query
            query={gql`
              {
                users(orderBy: username_ASC) {
                  id
                  username
                  email
                  userProfileImage
                  ReviewList {
                    id
                    name
                    thumbsUp
                    timestamp
                  }
                }
              }
            `}
          >
            {({ loading, error, data }) => {
              if (loading) return <p>Loading...</p>;
              if (error) return <p>Error :(</p>;

              const reviews = this.filterByCurrentMonthReviews(
                data.users
              ).slice(0, 8);

              return (
                <div className="card-container">
                  {reviews.map(({ id, username, userProfileImage }) => (
                    <Featured
                      key={id}
                      username={username}
                      image={userProfileImage}
                      clickHandler={this.clickUserHandler}
                    />
                  ))}
                </div>
              );
            }}
          </Query>
        </div>
      </div>
    );
  }
}

export default withAuthentication(Home);
