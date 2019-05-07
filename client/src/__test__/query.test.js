import { getUsers } from '../query.js';
import { MockedProvider } from 'react-apollo/test-utils';
import TestRenderer from 'react-test-renderer';
import { Query } from 'react-apollo';
import React from 'react';
import gql from 'graphql-tag';
// import jest,
const renderer = TestRenderer;

export const GET_USER_QUERY = gql`
 query getUser($name: String) {
  user: {
   id: '',
   username: '',
   userProfileImage: '',
   bio: '',
   email: '',
  }
}`;

const mocks = [
  {
    request: {
      query: GET_USER_QUERY,
      variables: {
        name: 'mtrew'
      }
    },
    result: {
      data: {
        user: {}
      }
    }
  }
];

export const User = ({ username }) => (
  <Query query={GET_USER_QUERY} variables={{ username }}>
    {({ loading, data, error }) => {
      if (loading) return <p>Loading...</p>;
      if (error) {
        console.log(error);
        return <p>Error!</p>;
      }
      return (
        <h1>
          {data.user.username} can be reached at {data.user.email}
        </h1>
      );
    }}
  </Query>
);

it('should render without error or crash', () => {
  renderer.create(<User name="mtrew" />);
});

// describe('Query returns proper user object', () => {

//  const userData = () => {
//  }

//  it('returns a user object properly', async () => {
//   const expected = {
//    data: {
//     user: {
//      id: '',
//      username: '',
//      userProfileImage: '',
//      bio: '',
//      email: '',
//     }
//    }

//   },

//   const actual;
//  })

//  it('user also has ReviewList and LikedReviews object', async () => {

//  })
// })
