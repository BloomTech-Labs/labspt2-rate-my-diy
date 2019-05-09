import { GET_USERS_QUERY, GET_PROJECTS } from '../test-queries/test-queries';

// query {
// 	users(first: 2) {A
// 	id
//   username
//   userProfileImage
//   bio
//   email
//   ReviewList {
//     id
//     name
//     rKey
//     text
//     Author {
// 			username
//     	}
//     ProjectReviewed {
//       id
//       name
//       key
//       category
//       titleImg
//       titleBlurb
//       rating
//       steps
//     }

//   }
//   }
// }

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

const projectMocks = [
  {
    request: {
      query: GET_PROJECTS
    },
    result: {
      data: {
        projects: [
          {
            titleBlurb: 'I hope you like my project',
            name: "Sarah's 1st Project",
            timestamp: '2019-02-01T00:00:00.000Z',
            id: 'cjunieivm00u60765x36nzgh1',
            rating: [1, 5, 4, 3, 2, 5, 4, 5, 5],
            User: {
              id: 'cjunieium00u50765xx6b78i5',
              username: 'asdfsd',
              email: 'asldkf@gmail.com'
            },
            titleImg:
              'https://res.cloudinary.com/dv1rhurfd/image/upload/c_scale,w_400/v1555355210/project%20images/doodle-3644073_640.png',
            category: 'random',
            steps:
              '[{"type":"img","body":"https://static.comicvine.com/uploads/scale_medium/11/114183/6665970-%24+%281%29.png"},{"type":"text","body":"Bender is great"}]'
          },
          {
            titleBlurb: 'I hope you like my project',
            name: "Sarah's 2nd Project",
            timestamp: '2019-02-15T00:00:00.000Z',
            id: 'cjunieixu00u80765y58g7pll',
            rating: [1, 4, 3, 2, 1, 1, 1],
            User: {
              id: 'cjunieium00u50765xx6b78i5',
              username: 'asdfsd',
              email: 'asldkf@gmail.com'
            },
            titleImg:
              'https://res.cloudinary.com/dv1rhurfd/image/upload/c_scale,w_400/v1555355210/project%20images/doodle-3644073_640.png',
            category: 'home improvement',
            steps:
              '[{"type":"img","body":"https://static.comicvine.com/uploads/scale_medium/11/114183/6665970-%24+%281%29.png"},{"type":"text","body":"Bender is great"}]'
          }
        ]
      }
    }
  }
];

module.exports = {
  userMocks,
  projectMocks
};
