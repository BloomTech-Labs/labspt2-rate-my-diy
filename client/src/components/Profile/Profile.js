import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
// import { Link } from 'react-router-dom';
import * as math from 'mathjs';
import ProjectCard from '../Account/ProjectCard/ProjectCard';
import ReviewCard from '../Account/ReviewCard/ReviewCard';
import "./Profile.scss"
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
  render() {
    const json = localStorage.getItem('authUser');

    const authUser = JSON.parse(json);

    let email = this.props.email;
    // if (user.email !== email) email = user.email
    console.log({ email: email });
    const UserWithData = () => (
      <Query query={GET_USER} variables={{ email: email }}>
        {({
          loading: userLoading,
          data: userData,
          error: userError,
          refetch: userRefetch
        }) => (
          <Query query={GET_USERS}>
            {({
              loading: usersLoading,
              data: usersData,
              error: usersError,
              refetch: usersRefetch
            }) => {
              if (userLoading || usersLoading) return <span>Loading...</span>;
              if (userError || usersError)
                return <span>{`Error: ${userError || usersError}`}</span>;

              if (userData !== undefined)
                userData = Object.values(userData).flat();
              const user = userData[0];
              if (usersData !== undefined)
                usersData = Object.values(usersData).flat();
              const users = usersData;
              const {
                id,
                username,
                userProfileImage,
                email,
                bio,
                accountType,
                ReviewList,
                Projects,
                LikedReviews,
                DislikedReviews,
                RatedProjects
              } = user;

              return (
               <React.Fragment>
                <div className="profile-container">
                  <div className="profile-info">
                  <div className="profile-user-content">
                  <h1>{`${username}`}</h1>
                  <img className="profile-img" src={userProfileImage} />
                  <p>{`${bio}`}</p>
                  </div>
                  <div>
                   <h2>{`${username}'s Reviews`}</h2>
                   <hr className="line-break" />
                  </div>
                    {ReviewList.map((review) => {
                      return (
                       <div className="rated-card-container">
                       <div className="inner-rated-card">
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
                    <span className="profile-username">
                    <h3>{`${username}'s Projects`}</h3>
                    </span>
                  <div className="profile-projects">

                    {Projects.map((project) => {
                      let meanRating = project.rating;
                      if (project.rating.length > 1)
                        meanRating = parseFloat(
                          math.mean(project.rating.slice(1)).toFixed(2)
                        );
                      if (project.rating.length === 1)
                        meanRating = parseFloat(
                          math.mean(project.rating).toFixed(2)
                        );

                      project.rating = meanRating;
                      return (
                       <div className="rated-card-container">
                       <div className="inner-rated-card">
                        <ProjectCard
                          key={project.id}
                          project={project}
                          reviews={ReviewList}
                          users={users}
                          user={user}
                          refetch={usersRefetch}
                        />
                        </div>
                        </div>
                      );
                    })}

                  </div>
                  <span className="liked-reviews">
                    <h2>{`Reviews Liked By ${username}`}</h2>
                  </span>
                  <hr className="line-break" />
                    {LikedReviews.map((review) => {
                      return (
                       <div className="rated-card-container">
                       <div className="inner-rated-card">
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
                  <div className="profile-disliked-reviews">
                    <h2>{`Reviews Disliked By ${username}`}</h2>
                    <hr className="line-break" />
                    {DislikedReviews.map((review) => {
                      return (
                       <div className="rated-card-container">
                       <div className="inner-rated-card">
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
                    <h2>{`Projects Rated By ${username}`}</h2>

                    {RatedProjects.map((project) => {
                     let meanRating = project.rating;
                     if (project.rating.length > 1)
                     meanRating = parseFloat(
                      math.mean(project.rating.slice(1)).toFixed(2)
                      );
                      if (project.rating.length === 1)
                      meanRating = parseFloat(
                       math.mean(project.rating).toFixed(2)
                       );
                       
                       project.rating = meanRating;
                       return (
                  <div className="rated-card-container">
                  <div className="inner-rated-card">
                        <ProjectCard
                          key={project.id}
                          project={project}
                          reviews={ReviewList}
                          users={users}
                          user={user}
                          refetch={usersRefetch}
                          />
                         </div>
                         </div>
                          );
                         })}

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
