import React from 'react';
import renderer from 'react-test-renderer';
import { MockedProvider } from 'react-apollo/test-utils';
import wait from 'waait';
import User, { GET_USERS_QUERY } from './User';
// import jest,
// const renderer = TestRenderer;

// export const GET_USER_QUERY = gql`
//  query getUser($name: String) {
//   user: {
//    id: '',
//    username: '',
//    userProfileImage: '',
//    bio: '',
//    email: '',
//   }
// }`;

it('should render loading state initially', () => {
  const component = renderer.create(
    <MockedProvider>
      <User />
    </MockedProvider>
  );
  const tree = component.toJSON();
  expect(tree.children).toContain('Loading...');
});

it('should render without error or crash', () => {
  const User = renderer.create(
    <MockedProvider mocks={[]}>
      <User />
    </MockedProvider>
  );
});
// const mocks = [
//   {
//     request: {
//       query: GET_USER_QUERY,
//       variables: {
//         name: 'mtrew'
//       }
//     },
//     result: {
//       data: {
//         user: {}
//       }
//     }
//   }
// ];

// export const User = ({ username }) => (
//   <Query query={GET_USER_QUERY} variables={{ username }}>
//     {({ loading, data, error }) => {
//       if (loading) return <p>Loading...</p>;
//       if (error) {
//         console.log(error);
//         return <p>Error!</p>;
//       }
//       return (
//         <h1>
//           {data.user.username} can be reached at {data.user.email}
//         </h1>
//       );
//     }}
//   </Query>
// );

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
