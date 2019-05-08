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

export const getProjects = gql`
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
      User {
        id
        usernameid
        name
        titleImg
        category
        rating
        timestamp
        steps
        titleBlurb
        User {
          id
          username
          email
        }
        email
      }
    }
  }
`;

export const getReviews = gql`
  {
    reviews {
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
`;

module.exports = {
  GET_USERS_QUERY
};
