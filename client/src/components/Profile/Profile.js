import React from 'react';
import ReviewCard from '../ReviewCard/ReviewCard';
import './Profile.scss';
import ProjectCard from '../ProjectCard/ProjectCard';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

class Profile extends React.Component {
  render() {
    if (this.props.users[0]) {
      let email = this.props.email;
      const users = this.props.users;
      const user = this.props.users.filter((userInstance) => {
        return userInstance.email === email;
      })[0];
      console.log({email: email, user: user})

      return (
        <React.Fragment>
          <div className="profile-container">
            <div className="profile-info">
              <div className="profile-user-content">
                <h1>{`${user.username}`}</h1>
                <img
                  className="profile-img"
                  src={user.userProfileImage}
                  alt="profile"
                />
                <p>{`${user.bio}`}</p>
              </div>
              <div>
                <h2>{`${user.username}'s Reviews`}</h2>
                <hr className="line-break" />
              </div>
              {user.ReviewList.map((review) => {
                return (
                  <div className="rated-card-container" key={review.id}>
                    <div className="inner-rated-card">
                      <ReviewCard
                        review={review}
                        users={users}
                        user={user}
                        refetch={this.props.refetch}
                        loggedIn={this.props.loggedIn}
                        authUser={this.props.authUser}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <span className="profile-username">
              <h3>{`${user.username}'s Projects`}</h3>
            </span>
            <div className="profile-projects">
              {user.Projects.map((project) => {
                return (
                  <div className="profile-project-card" key={project.id}>
                    <ProjectCard
                      project={project}
                      reviews={user.ReviewList}
                      users={users}
                      user={user}
                      refetch={this.props.refetch}
                    />
                  </div>
                );
              })}
            </div>
            <span className="liked-reviews">
              <h2>{`Reviews Liked By ${user.username}`}</h2>
            </span>
            <hr className="line-break" />
            {user.LikedReviews.map((review) => {
              return (
                <div className="rated-card-container" key={review.id}>
                  <div className="inner-rated-card">
                    <ReviewCard
                      review={review}
                      users={users}
                      user={user}
                      refetch={this.props.refetch}
                      loggedIn={this.props.loggedIn}
                      authUser={this.props.authUser}
                    />
                  </div>
                </div>
              );
            })}
            <div className="profile-disliked-reviews">
              <h2>{`Reviews Disliked By ${user.username}`}</h2>
              <hr className="line-break" />
              {user.DislikedReviews.map((review) => {
                return (
                  <div className="rated-card-container">
                    <div className="inner-rated-card">
                      <ReviewCard
                        key={review.id}
                        review={review}
                        users={users}
                        user={user}
                        refetch={this.props.refetch}
                        loggedIn={this.props.loggedIn}
                        authUser={this.props.authUser}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <h2>{`Projects Rated By ${user.username}`}</h2>

            {user.RatedProjects.map((project) => {
              return (
                <div className="rated-card-container" key={project.id}>
                  <div className="inner-rated-card">
                    <ProjectCard
                      project={project}
                      reviews={user.ReviewList}
                      users={users}
                      user={user}
                      refetch={this.props.refetch}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <div className="profile-container">
            <SkeletonTheme highlightColor="#6fb3b8">
              <div className="profile-info">
                <div className="profile-user-content">
                  <h1>
                    <Skeleton />
                  </h1>
                  <div className="profile-img">
                    <Skeleton height={150} />
                  </div>
                  <p>
                    <Skeleton />
                  </p>
                </div>
                <div>
                  <h2>
                    <Skeleton />
                  </h2>
                  <hr className="line-break" />
                </div>

                <div className="rated-card-container">
                  <div className="inner-rated-card">
                    <Skeleton />
                  </div>
                  <div className="inner-rated-card">
                    <Skeleton />
                  </div>
                  <div className="inner-rated-card">
                    <Skeleton />
                  </div>
                </div>
              </div>
              <span className="profile-username">
                <h3>
                  <Skeleton />
                </h3>
              </span>
              <div className="profile-projects">
                <div className="profile-project-card">
                  <Skeleton />
                </div>
                <div className="profile-project-card">
                  <Skeleton />
                </div>
                <div className="profile-project-card">
                  <Skeleton />
                </div>
              </div>
              <span className="liked-reviews">
                <h2>
                  <Skeleton />
                </h2>
              </span>
              <hr className="line-break" />

              <div className="rated-card-container">
                <div className="inner-rated-card">
                  <Skeleton />
                </div>
                <div className="inner-rated-card">
                  <Skeleton />
                </div>
                <div className="inner-rated-card">
                  <Skeleton />
                </div>
              </div>

              <div className="profile-disliked-reviews">
                <h2>
                  <Skeleton />
                </h2>
                <hr className="line-break" />

                <div className="rated-card-container">
                  <div className="inner-rated-card">
                    <Skeleton />
                  </div>
                  <div className="inner-rated-card">
                    <Skeleton />
                  </div>
                  <div className="inner-rated-card">
                    <Skeleton />
                  </div>
                </div>
              </div>
              <h2>
                <Skeleton />
              </h2>

              <div className="rated-card-container">
                <div className="inner-rated-card">
                  <Skeleton />
                </div>
                <div className="inner-rated-card">
                  <Skeleton />
                </div>
                <div className="inner-rated-card">
                  <Skeleton />
                </div>
              </div>
            </SkeletonTheme>
          </div>
        </React.Fragment>
      );
    }
  }
}

export default Profile;
