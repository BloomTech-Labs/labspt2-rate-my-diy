import gql from 'graphql-tag';

export const getUsers = gql`
  {
    users {
      id
      username
      userProfileImage
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
    }
  }
`;
export const getProjects = gql`
  {
    projects {
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
        username
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

export const CREATE_PROJECT = gql`
  mutation newProject(
    $name: String!
    $category: String!
    $timestamp: String!
    $titleImg: String!
    $titleBlurb: String!
    $steps: String!
    $username: String!
  ) {
    newProject(
      name: $name
      category: $category
      timestamp: $timestamp
      titleImg: $titleImg
      titleBlurb: $titleBlurb
      steps: $steps
      username: $username
    ) {
      id
      name
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation editProject(
    $name: String!
    $category: String!
    $timestamp: String!
    $titleImg: String!
    $titleBlurb: String!
    $steps: String!
    $username: String!
    $id: ID!
  ) {
    editProject(
      name: $name
      category: $category
      timestamp: $timestamp
      titleImg: $titleImg
      titleBlurb: $titleBlurb
      steps: $steps
      username: $username
      id: $id
    ) {
      id
      name
    }
  }
`;

export const editReview = gql`
  mutation editReview(
    $name: String!
    $text: String!
    $timestamp: string!
    $projId: ID!
    $revId: ID!
    $projRating: Int
  ) {
    editReview(
      name: $name
      text: $text
      timestamp: $timestamp
      projId: $projId
      revId: $revId
      projRating: $projRating
    ) {
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

export const NEW_REVIEW = gql`
  mutation newReview(
    $name: String!
    $text: String!
    $timestamp: String!
    $user: String!
    $username: String!
    $id: ID!
    $projRating: Int
  ) {
    newReview(
      name: $name
      text: $text
      timestamp: $timestamp
      user: $user
      username: $username
      id: $id
      projRating: $projRating
    ) {
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

export const dislikeAReview = gql`
  mutation dislikeAReview($revId: ID!, $id: ID!, $username: String!) {
    dislikeAReview(revId: $revId, id: $raterId, username: $username) {
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

export const likeAReview = gql`
  mutation likeAReview($revId: ID!, $id: ID!, $username: String!) {
    likeAReview(revId: $revId, id: $raterId, username: $username) {
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
