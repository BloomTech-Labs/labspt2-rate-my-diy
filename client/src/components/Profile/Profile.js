import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
// import { Link } from 'react-router-dom';
import * as math from 'mathjs';
import ProjectCard from '../Account/ProjectCard/ProjectCard';
import ReviewCard from '../Account/ReviewCard/ReviewCard';

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
        Author {
          id
          username
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
    const email = this.props.email;
    const UserWithData = () => (
      <Query query={GET_USER} variables={{ email: email }}>
        {({ loading, data, error }) => {
          if (loading) return <span>Loading...</span>;
          if (error) return <span>{`Error: ${error}`}</span>;

          if (data !== undefined) data = Object.values(data).flat();
          const user = data[0];
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
            <div>
              <h1>{`${username}`}</h1>
              <img src={userProfileImage} />
              <p>{`${bio}`}</p>
              <div>
                <h2>{`${username}'s Reviews`}</h2>
                {ReviewList.map((review) => {
                  return <ReviewCard key={review.id} review={review} />;
                })}
              </div>
              <div>
                <h2>{`${username}'s Projects`}</h2>
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
                    <ProjectCard
                      key={project.id}
                      project={project}
                      reviews={ReviewList}
                      users={data}
                    />
                  );
                })}
              </div>
              <div>
                <h2>{`Reviews Liked By ${username}`}</h2>
                {LikedReviews.map((review) => {
                  return <ReviewCard key={review.id} review={review} />;
                })}
              </div>
              <div>
                <h2>{`Reviews Disliked By ${username}`}</h2>
                {DislikedReviews.map((review) => {
                  return <ReviewCard key={review.id} review={review} />;
                })}
              </div>
              <div>
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
                    <ProjectCard
                      key={project.id}
                      project={project}
                      reviews={ReviewList}
                      users={data}
                    />
                  );
                })}
              </div>
            </div>
          );
        }}
      </Query>
    );
    return <UserWithData />;
  }
}

export default Profile;
