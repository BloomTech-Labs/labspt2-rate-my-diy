import gql from 'graphql-tag';

export const getUsers = gql`
  {
    users {
      id
      username
      userProfileImage
      bio
      email
      RatedProjects {
        id
      }
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
          titleImg
        }
      }
      LikedReviews {
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
          titleImg
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
          titleImg
        }
      }
    }
  }
`;

export const GET_USERS_QUERY = gql`
  # Only the first two users.
  {
    users(first: 2) {
      id
      username
      userProfileImage
      bio
      email
    }
  }
`;

export const GET_PROJECTS = gql`
  {
    projects(first: 2) {
      id
      name
      titleImg
      category
      rating
      timestamp
      steps
      titleBlurb
    }
  }
`;

export const GET_REVIEWS = gql`
  {
    reviews {
      id
      name
      text
      timestamp
      thumbsUp
      thumbsDown
      projRating
    }
  }
`;

module.exports = {
  GET_USERS_QUERY,
  GET_PROJECTS
};
