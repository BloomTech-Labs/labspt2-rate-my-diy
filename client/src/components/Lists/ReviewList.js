import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import ReviewCard from '../ReviewCard/ReviewCard'
import { Link } from 'react-router-dom'
import { getUsers } from '../../query/query'
import plus from '../../img/plus.png'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

import './ReviewList.scss'

const GET_REVIEWS = gql`
  query reviews($email: String!) {
    reviews(where: { Author: { email: $email } }, orderBy: timestamp_DESC) {
      id
      name
      rKey
      text
      timestamp
      thumbsUp
      thumbsDown
      Author {
        id
        username
        email
      }
      ProjectReviewed {
        id
        name
        titleImg
        timestamp
        User {
          id
          username
        }
      }
    }
  }
`

const GET_USER = gql`
  query user($email: String!) {
    user(where: { email: $email }) {
      id
      username
    }
  }
`

class ReviewList extends React.Component {
  render() {
    const json = localStorage.getItem('authUser')
    const user = JSON.parse(json)
    const email = this.props.email || user.email || 'asldkf@gmail.com'

    const ReviewListWithData = () => (
      <Query query={GET_REVIEWS} variables={{ email: email }}>
        {({
          loading: reviewsLoading,
          error: reviewsError,
          data: reviewsData,
        }) => (
          <Query query={GET_USER} variables={{ email: email }}>
            {({ loading: userLoading, data: userData, error: userError }) => (
              <Query query={getUsers}>
                {({
                  loading: usersLoading,
                  data: usersData,
                  error: usersError,
                }) => {
                  if (reviewsLoading || userLoading || usersLoading)
                    return (
                      <div className="review-list-all-container">
                        <SkeletonTheme highlightColor="#6fb3b8">
                          <h1 className="review-list-title">
                            <Skeleton />
                          </h1>
                          <div className="review-list-container">
                            <div className="review-list-card">
                              <div>
                                <div className="reiew-list-card-img">
                                  <Skeleton height={280} width={380} />
                                </div>
                                <p>
                                  <Skeleton />
                                </p>
                              </div>
                            </div>
                            <div className="review-list-card">
                              <div>
                                <div className="reiew-list-card-img">
                                  <Skeleton height={280} width={380} />
                                </div>
                                <p>
                                  <Skeleton />
                                </p>
                              </div>
                            </div>
                            <div className="review-list-card">
                              <div>
                                <div className="reiew-list-card-img">
                                  <Skeleton height={280} width={380} />
                                </div>
                                <p>
                                  <Skeleton />
                                </p>
                              </div>
                            </div>
                          </div>
                        </SkeletonTheme>
                      </div>
                    )
                  if (reviewsError || userError || usersError) return `Error!`

                  if (reviewsData.reviews[0]) {
                    return (
                      <div className="review-list-all-container">
                        <h1 className="review-list-title">{`${
                          userData.user.username
                        }'s Reviews`}</h1>
                        <div className="review-list-container">
                          {reviewsData.reviews.map((review) => {
                            return (
                              <ReviewCard
                                key={review.id}
                                review={review}
                                users={usersData.users}
                                user={userData.user}
                                revRefetch={this.props.revRefetch}
                                userRefetch={this.props.userRefetch}
                                loggedIn={this.props.loggedIn}
                                authUser={this.props.authUser}
                              />
                            )
                          })}
                          <div className="review-list-card">
                            <div>
                              <Link to="/search">
                                <img
                                  className="review-list-card-img"
                                  src={plus}
                                  alt="plus"
                                />
                                <p>Find a Project to Review</p>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  } else {
                    return (
                      <div className="review-list-all-container">
                        <h1 className="review-list-title">{`${
                          userData.user.username
                        }'s Reviews`}</h1>
                        <div className="review-list-card">
                          <div>
                            <Link to="/search">
                              <img
                                className="review-list-card-img"
                                src={plus}
                                alt="plus"
                              />
                              <p>Find a Project to Review</p>
                            </Link>
                          </div>
                        </div>
                      </div>
                    )
                  }
                }}
              </Query>
            )}
          </Query>
        )}
      </Query>
    )
    return <ReviewListWithData />
  }
}

export default ReviewList
