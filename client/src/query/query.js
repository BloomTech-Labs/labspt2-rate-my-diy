import gql from 'graphql-tag';

export const getUsers = gql`
  {
    users {
      id
      username
      userProfileImage
      email
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
      Author {
        id
        username
        email
      }
      ProjectReviewed {
        id
        name
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
