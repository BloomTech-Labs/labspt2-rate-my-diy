import React from 'react'
import ReviewCard from '../ReviewCard/ReviewCard'
import Featured from '../Home/Featured/Featured'
import './Profile.scss'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

class Profile extends React.Component {
  render() {
    if (this.props.users[0]) {
      let email = this.props.email
      const users = this.props.users
      const user = this.props.users.filter((userInstance) => {
        return userInstance.email === email
      })[0]
      const {
        username,
        userProfileImage,
        bio,
        ReviewList,
        Projects,
        LikedReviews,
        DislikedReviews,
        RatedProjects,
      } = user

      return (
        <React.Fragment>
          <div className="profile-container">
            <div className="profile-info">
              <div className="profile-user-content">
                <h1>{`${username}`}</h1>
                <img
                  className="profile-img"
                  src={userProfileImage}
                  alt="profile"
                />
                <p>{`${bio}`}</p>
              </div>
              {ReviewList.length >= 1 ? (
                <h2>{`${username}'s Reviews`}</h2>
              ) : null}

              <div className="profileReviewContainer">
                {ReviewList.map((review) => {
                  return (
                    <div className="rated-card-container" key={review.id}>
                      <div className="inner-rated-card">
                        <ReviewCard
                          review={review}
                          users={users}
                          user={user}
                          revRefetch={this.props.revRefetch}
                          userRefetch={this.props.userRefetch}
                          loggedIn={this.props.loggedIn}
                          authUser={this.props.authUser}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            {Projects.length >= 1 ? <h2>{`${username}'s Projects`}</h2> : null}

            <div className="profile-projects">
              {Projects.map((project) => {
                let meanRating = project.rating

                return (
                  <div className="profile-project-card" key={project.id}>
                    <Featured
                      id={project.id}
                      image={project.titleImg}
                      rating={meanRating}
                      title={project.name}
                      username={project.User.username}
                      clickHandler={this.clickUserHandler}
                    />
                  </div>
                )
              })}
            </div>
            {LikedReviews.length >= 1 ? (
              <h2>{`Reviews Liked By ${username}`}</h2>
            ) : null}

            <hr className="line-break" />
            <div className="profileReviewContainer">
              {LikedReviews.map((review) => {
                return (
                  <div className="rated-card-container" key={review.id}>
                    <div className="inner-rated-card">
                      <ReviewCard
                        review={review}
                        users={users}
                        user={user}
                        revRefetch={this.props.revRefetch}
                        userRefetch={this.props.userRefetch}
                        loggedIn={this.props.loggedIn}
                        authUser={this.props.authUser}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            {DislikedReviews.length >= 1 ? (
              <h2>{`Reviews Disliked By ${username}`}</h2>
            ) : null}
            <div className="profileReviewContainer">
              {DislikedReviews.map((review) => {
                return (
                  <div className="rated-card-container" key={review.id}>
                    <div className="inner-rated-card">
                      <ReviewCard
                        loggedIn={this.props.loggedIn}
                        review={review}
                        users={users}
                        user={user}
                        revRefetch={this.props.revRefetch}
                        userRefetch={this.props.userRefetch}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            {RatedProjects.length >= 1 ? (
              <h2>{`Projects Rated By ${username}`}</h2>
            ) : null}

            <div className="profile-projects">
              {RatedProjects.map((project) => {
                let meanRating = project.rating

                return (
                  <div className="profile-project-card" key={project.id}>
                    <Featured
                      key={project.id}
                      id={project.id}
                      image={project.titleImg}
                      rating={meanRating}
                      title={project.name}
                      username={project.User.username}
                      clickHandler={this.clickUserHandler}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          <SkeletonTheme highlightColor="#6fb3b8">
            <div className="profile-container">
              <div className="profile-info">
                <div className="profile-user-content">
                  <h1>
                    <Skeleton />
                  </h1>
                  <div className="profile-img">
                    <Skeleton />
                  </div>
                  <p>
                    <Skeleton />
                  </p>
                </div>
                <h2>Reviews</h2>

                <div className="project-profile-container">
                  <div className="profile-project-card">
                    <Featured />
                  </div>
                  <div className="profile-project-card">
                    <Featured />
                  </div>
                  <div className="profile-project-card">
                    <Featured />
                  </div>
                </div>
              </div>
              <h2>Projects</h2>

              <div className="profile-projects">
                <div className="profile-project-card">
                  <Featured />
                </div>
                <div className="profile-project-card">
                  <Featured />
                </div>
                <div className="profile-project-card">
                  <Featured />
                </div>
              </div>
              <h2>Liked Reviews</h2>

              <hr className="line-break" />
              <div className="profileReviewContainer">
                <div className="profile-project-card">
                  <Featured />
                </div>
                <div className="profile-project-card">
                  <Featured />
                </div>
                <div className="profile-project-card">
                  <Featured />
                </div>
              </div>
              <h2>Disliked Reviews</h2>
              <div className="profileReviewContainer">
                <div className="profile-project-card">
                  <Featured />
                </div>
                <div className="profile-project-card">
                  <Featured />
                </div>
                <div className="profile-project-card">
                  <Featured />
                </div>
              </div>
              <h2>Rated Projects</h2>

              <div className="project-profile-container">
                <div className="profile-project-card">
                  <Featured />
                </div>
                <div className="profile-project-card">
                  <Featured />
                </div>
                <div className="profile-project-card">
                  <Featured />
                </div>
              </div>
            </div>
          </SkeletonTheme>
        </React.Fragment>
      )
    }
  }
}

export default Profile
