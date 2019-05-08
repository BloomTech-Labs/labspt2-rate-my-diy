import React from 'react';
import renderer from 'react-test-renderer';
import { MockedProvider } from 'react-apollo/test-utils';
import wait from 'waait';
import Users from './Users';
import { userMocks } from '../data-mocks/data-mocks';

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
    <MockedProvider mocks={userMocks}>
      <Users />
    </MockedProvider>
  );
  const tree = component.toJSON();
  expect(tree.children).toContain('Loading...');
});

it('should render without error or crash', () => {
  const component = renderer.create(
    <MockedProvider mocks={userMocks}>
      <Users />
    </MockedProvider>
  );
});
// const mocks = [
//   {
//     request: {
//       query: GET_USERS_QUERY
//     },
//     result: {
//       data: {
//         users: [
//           {
//             email: 'asldkf@gmail.com',
//             username: 'asdfsd',
//             bio: 'Hi, this is my page where I share projects and reviews',
//             id: 'cjunieium00u50765xx6b78i5',
//             userProfileImage:
//               'https://res.cloudinary.com/dv1rhurfd/image/upload/v1555353676/avatars/avatar-6.png'
//           },
//           {
//             email: 'lkjwe@gmail.com',
//             username: 'sldfksd',
//             bio: 'Hi, this is my page where I share projects and reviews',
//             id: 'cjuniej0p00uh0765iw80avuy',
//             userProfileImage:
//               'https://res.cloudinary.com/dv1rhurfd/image/upload/v1555353676/avatars/avatar-7.png'
//           }
//         ]
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
