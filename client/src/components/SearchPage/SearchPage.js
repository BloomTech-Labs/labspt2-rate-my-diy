import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../Searchbar/Searchbar';
import { Query } from 'react-apollo';
import { withAuthentication } from '../Session/session';
import * as math from 'mathjs';
import ReviewCard from '../Account/ReviewCard/ReviewCard';
import { getUsers } from '../../query/query';

import Header from '../Home/Header/Header';
import '../../styles/card.scss';
import './SearchPage.scss';
import star from '../../img/star.png';

class SearchPage extends Component {
  constructor() {
    super();
    this.state = {
      userClicked: null,
      isLoggedIn: false,
      user: '',
      userArray: []
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
                  if (userError) console.log({ userError: userError });
                  if (projectError) console.log({ projectError: projectError });
                  if (reviewError) console.log({ projectError: reviewError });
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
      <div id="home-container">
        <Header />
        <SearchWithData />
        <h1>Results:</h1>
        <div className="card-container">
          {this.props.projects
            .map(({ id, name, titleImg, rating, User, category }) => {
              let meanRating = rating;
              if (rating.length > 1)
                meanRating = parseFloat(math.mean(rating.slice(1)).toFixed(2));
              if (rating.length === 1)
                meanRating = parseFloat(math.mean(rating).toFixed(2));

              let meanRating = parseFloat(math.mean(rating).toFixed(2));

              const stars = [];

              for (let i = 0; i < Math.round(meanRating); i++) {
                stars.push(<img src={star} alt="star" key={i} />);
              }

              return (
                <div>
                  <div key={id} className="card">
                    <img src={`${titleImg}`} alt="project" />

                    <Link to={`/projects/${id}`}>{`${name}`}</Link>
                    {/* <div>{`${name}`}</div> */}
                    <div>{`${meanRating}`}</div>
                    <div>{`${category}`}</div>
                    <Link to={`/${User.username}/profile`}>
                      <div>{`${User.username}`}</div>
                    </Link>

                    <Link to={`/${User.username}/projects`}>
                      <h2>{name}</h2>
                    </Link>
                    <div className="rating-container">
                      {stars.map((star) => {
                        return star;
                      })}
                    </div>
                    <div>{`${category}`}</div>
                    <Link to={`/${User.username}/profile`}>
                      <div>{`${User.username}`}</div>
                    </Link>
                  </div>
                  <p>{category}</p>
                  <p>@{User.username}</p>
                </div>
              );
            })
            .concat(
              this.props.users.map(({ id, username, userProfileImage }) => (
                <div key={id} className="card">
                  <img src={`${userProfileImage}`} alt="user" />
                  <Link to={`/${username}/profile`}>
                    <div>{`${username}`}</div>
                  </Link>
                </div>
              ))
            )
            .concat(
              this.props.reviews.map(
                ({ id, name, text, timestamp, Author, ProjectReviewed }) => (
                  <div key={id} className="card">
                    <img src={`${userProfileImage}`} alt="user" />
                    <Link to={`/${username}/profile`}>
                      <div>{`${username}`}</div>
                    </Link>
                  </div>
                )
              )
            )
            .concat(
              this.props.reviews.map((review) => {
                return (
                  <Query query={getUsers} key={review.id}>
                    {({ loading, data, error, refetch }) => {
                      if (loading) return null;
                      if (error) return null;
                      if (data) {
                        let user = data.users.filter(
                          (user) => user.email === review.Author.email
                        );
                        console.log({ searchuser: user });
                        let rev = user[0].ReviewList.filter(
                          (r) => r.id === review.id
                        )[0];
                        console.log({ rev: rev, review: review });
                        return (
                          <div key={review.id} className="card-container">
                            {/* <Link to={`/reviews/${id}`}>{`${name}`}</Link>
                    
                    <div>{`${text}`}</div>
                    <div>{`${timestamp}`}</div>
                    <Link to={`/${Author.username}/profile`}>
                      <div>{`${Author.username}`}</div>
                    </Link>
                    <div>{`${ProjectReviewed.name}`}</div> */}
                            <ReviewCard
                              review={rev}
                              refetch={refetch}
                              users={data.users}
                              user={user}
                              refetch={refetch}
                            />
                          </div>
                        );
                      }
                    }}
                  </Query>
                );
              })
            )}
        </div>
      </div>
    );
  }
}

export default withAuthentication(SearchPage);
