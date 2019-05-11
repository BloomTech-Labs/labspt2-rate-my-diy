import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../Searchbar/Searchbar';
import { Query } from 'react-apollo';
import { withAuthentication } from '../Session/session';
import * as math from 'mathjs';
import ReviewCard from '../ReviewCard/ReviewCard';
import { getUsers } from '../../query/query';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

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
    if (this.props.userArray[0]) {
      return (
        <>
          <SearchBar
            {...this.props}
            userClicked={this.state.userClicked}
            user={this.state.user}
            loggedIn={this.state.isLoggedIn}
            users={this.props.userArray}
            projects={this.props.projectArray}
            reviews={this.props.reviewArray}
            projectSearchHandler={this.props.projectSearchHandler}
            userSearchHandler={this.props.userSearchHandler}
            reviewSearchHandler={this.props.reviewSearchHandler}
          />
          <div className="search-container">
            <h1 className="results">Results</h1>
            <div className="search-card-container">
              {this.props.projects
                .map(({ id, name, titleImg, rating, User, category }) => {
                  let meanRating = rating;
                  if (rating.length > 1)
                    meanRating = parseFloat(
                      math.mean(rating.slice(1)).toFixed(2)
                    );
                  if (rating.length === 1)
                    meanRating = parseFloat(math.mean(rating).toFixed(2));

                  const stars = [];

                  for (let i = 0; i < Math.round(meanRating); i++) {
                    stars.push(
                      <img src={star} className="stars" alt="star" key={i} />
                    );
                  }

                  return (
                    <div className="searchReviewCard" key={id}>
                      <div>
                        <img
                          className="searchProjectImage"
                          src={`${titleImg}`}
                          alt="project"
                        />

                        <Link className="project-title" to={`/projects/${id}`}>
                          <h3>{`${name}`}</h3>
                        </Link>

                        <p>{`Category: ${category}`}</p>
                        <Link to={`/${User.username}/profile`}>
                          <p className="createdBy">
                            {' '}
                            {`Created by: ${User.username}`}
                          </p>
                        </Link>
                        <p> {`Average Rating: ${meanRating}`}</p>
                        <div className="search-rating-container">
                          {stars.map((star) => {
                            return star;
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })
                .concat(
                  this.props.users.map(({ id, username, userProfileImage }) => (
                    <div className="searchReviewCard" key={id}>
                      <img
                        className="searchProjectImage"
                        src={`${userProfileImage}`}
                        alt="user"
                      />
                      <Link to={`/${username}/profile`}>
                        <h3>{`User Name: ${username}`}</h3>
                      </Link>
                      <Link to={`/${username}/projects`}>
                        <h4 id="searchProjectButton">View My Projects</h4>
                      </Link>
                    </div>
                  ))
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
                            console.log(
                              { rev: rev, review: review },
                              'check this out'
                            );

                            return (
                              <ReviewCard
                                review={rev}
                                refetch={refetch}
                                users={data.users}
                                user={user}
                              />
                            );
                          }
                        }}
                      </Query>
                    );
                  })
                )}
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <SearchBar />
          <div className="search-container">
            <h1 className="results">Results</h1>
            <div className="search-card-container">
              <div className="searchReviewCard">
                <SkeletonTheme highlightColor="#6fb3b8">
                  <div>
                    <div className="searchProjectImage">
                      <Skeleton height={300} width={390} />
                    </div>

                    <h3 className="project-title">
                      <Skeleton />
                    </h3>

                    <Skeleton count={3} />
                  </div>
                </SkeletonTheme>
              </div>

              <div className="searchReviewCard">
                <SkeletonTheme highlightColor="#6fb3b8">
                  <div>
                    <div className="searchProjectImage">
                      <Skeleton height={300} width={390} />
                    </div>

                    <h3 className="project-title">
                      <Skeleton />
                    </h3>

                    <Skeleton count={3} />
                  </div>
                </SkeletonTheme>
              </div>

              <div className="searchReviewCard">
                <SkeletonTheme highlightColor="#6fb3b8">
                  <div>
                    <div className="searchProjectImage">
                      <Skeleton height={300} width={390} />
                    </div>

                    <h3 className="project-title">
                      <Skeleton />
                    </h3>

                    <Skeleton count={3} />
                  </div>
                </SkeletonTheme>
              </div>
            </div>
          </div>
        </>
      );
    }
  }
}

export default withAuthentication(SearchPage);
