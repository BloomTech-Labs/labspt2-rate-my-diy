import { GET_USERS_QUERY } from '../test-queries/test-queries';

const userMocks = [
  {
    request: {
      query: GET_USERS_QUERY
    },
    result: {
      data: {
        users: [
          {
            email: 'asldkf@gmail.com',
            username: 'asdfsd',
            bio: 'Hi, this is my page where I share projects and reviews',
            id: 'cjunieium00u50765xx6b78i5',
            userProfileImage:
              'https://res.cloudinary.com/dv1rhurfd/image/upload/v1555353676/avatars/avatar-6.png'
          },
          {
            email: 'lkjwe@gmail.com',
            username: 'sldfksd',
            bio: 'Hi, this is my page where I share projects and reviews',
            id: 'cjuniej0p00uh0765iw80avuy',
            userProfileImage:
              'https://res.cloudinary.com/dv1rhurfd/image/upload/v1555353676/avatars/avatar-7.png'
          }
        ]
      }
    }
  }
];

module.exports = {
  userMocks
};
