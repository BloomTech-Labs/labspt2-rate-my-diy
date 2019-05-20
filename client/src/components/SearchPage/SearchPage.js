import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import SearchBar from '../Searchbar/Searchbar'
import { Query } from 'react-apollo'
import { withAuthentication } from '../Session/session'
import ReviewCard from '../ReviewCard/ReviewCard'
import { getUsers } from '../../query/query'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

import '../../styles/card.scss'
import './SearchPage.scss'
import star from '../../img/star.png'

class SearchPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userClicked: null,
      isLoggedIn: this.props.loggedIn,
      user: '',
      userArray: [],
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
                  const stars = []

                  for (let i = 0; i < Math.round(rating); i++) {
                    stars.push(
                      <img src={star} className="stars" alt="star" key={i} />
                    )
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
                        <Link to={`/${User.username}/profile`}>
                          <p className="createdBy">{`@${User.username}`}</p>
                        </Link>
                        <p>{`Category: ${category}`}</p>

                        <p> {`Average Rating: ${rating}`}</p>
                        <div className="search-rating-container">
                          {stars.map((star) => {
                            return star
                          })}
                        </div>
                      </div>
                    </div>
                  )
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
                        <h3>{`@${username}`}</h3>
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
                          if (loading) return null

                          if (error) return null
                          if (data) {
                            let user = data.users.filter(
                              (user) => user.email === review.Author.email
                            )

                            return (
                              <ReviewCard
                                review={review}
                                users={data.users}
                                user={user}
                                loggedIn={this.props.loggedIn}
                                authUser={this.props.authUser}
                                revRefetch={refetch}
                                userRefetch={this.props.userRefetch}
                              />
                            )
                          }
                        }}
                      </Query>
                    )
                  })
                )}
            </div>
          </div>
        </>
      )
    } else {
      return (
        <>
          <SearchBar loggedIn={this.state.isLoggedIn} />
          <div className="search-container">
            <h1 className="results">Results</h1>
            <div className="search-card-container">
              <div className="searchReviewCard">
                <SkeletonTheme highlightColor="#6fb3b8">
                  <div>
                    <div className="searchProjectImage">
                      <Skeleton height={280} width={380} />
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
                      <Skeleton height={280} width={380} />
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
                      <Skeleton height={280} width={380} />
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
      )
    }
  }
}

export default withAuthentication(SearchPage)
