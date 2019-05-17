import gql from 'graphql-tag'

export const getUsers = gql`
  query {
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
`
export const getProjects = gql`
  query {
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
`

export const getReviews = gql`
  query {
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
`

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
`

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
`

export const editUser = gql`
  mutation editUser(
    $userProfileImage: String!
    $bio: String!
    $email: String!
  ) {
    editUser(userProfileImage: $userProfileImage, bio: $bio, email: $email) {
      id
      username
      userProfileImage
      bio
      email
    }
  }
`

export const editReview = gql`
  mutation editReview(
    $name: String!
    $text: String!
    $timestamp: String!
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
`

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
`

export const dislikeAReview = gql`
  mutation dislikeAReview(
    $revId: ID!
    $username: String!
    $didThumbDown: Boolean!
  ) {
    dislikeAReview(
      revId: $revId
      username: $username
      didThumbDown: $didThumbDown
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
`

export const likeAReview = gql`
  mutation likeAReview($revId: ID!, $username: String!, $didThumbUp: Boolean!) {
    likeAReview(revId: $revId, username: $username, didThumbUp: $didThumbUp) {
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
`
