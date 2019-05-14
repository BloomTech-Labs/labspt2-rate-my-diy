'use strict';
const EGQLT = require('easygraphql-tester');
const fs = require('fs');
const path = require('path');
// const testSchema = require('../mock-schema.graphql')
const { expect } = require('chai');
const schema = fs.readFileSync(
  path.join(__dirname, '..', '../../server/__tests__/mock-schema.graphql'),
  'utf8'
);

describe('Testing schema (User), Query', () => {
  let tester;
  beforeAll(() => {
    tester = new EGQLT(schema);
  });

  describe('Should pass if the root level users query is valid.', () => {
    it('Is a valid users query.', () => {
      const validUsersQuery = `
 {
  users {
   id
   thirdPartyUID
   firebaseUID
   username
   email
   userProfileImage
   bio
   privilege
   stripeId
   accountType
  }
 }
`;
      tester.test(true, validUsersQuery);
    });
  });
  describe('Should pass iff the root level users query is invalid', () => {
    it('Is an invalid users query.', () => {
      const invalidUsersQuery = `
     {
      users {
       id
       thirdPartyUID
       firebaseUID
       username
       email
       invalidField
       userProfileImage
       bio
       privilege
       stripeId
       accountType
       ReviewList
       LikedReviews
       DislikedReviews
       Projects
       RatedProjects
      }
     }
    `;
      tester.test(false, invalidUsersQuery);
    });
  });

  describe('Should pass if the root level user query is valid.', () => {
    it('Is a valid user query.', () => {
      const validUserQuery = `
{
 user(where: {id: "test"}) {
  id
  thirdPartyUID
  firebaseUID
  username
  email
  userProfileImage
  bio
  privilege
  stripeId
  accountType
 }
}
`;

      const userFixture = {
        data: {
          user: {
            id: 'test',
            thirdPartyUID: 'test',
            firebaseUID: 'test',
            username: 'test',
            email: 'test',
            userProfileImage: 'test',
            bio: 'test',
            privilege: 'test',
            stripeId: 'test',
            accountType: 'test'
          }
        }
      };
      tester.mock({
        query: validUserQuery,
        variables: userFixture,
        validateDeprecated: true
      });
    });
  });

  describe('Should pass if the root level user query is invalid.', () => {
    it('Is an invalid users query.', () => {
      const invalidUserQuery = `
{
user(where: {id: "test"}) {
 id
 thirdPartyUID
 firebaseUID
 username
 email
 invalidField
 userProfileImage
 bio
 privilege
 stripeId
 accountType
}
}
`;
      tester.test(false, invalidUserQuery);
    });
  });
  describe('Should pass if the nested users query is valid.', () => {
    it('Is a valid nested users query.', () => {
      const validNestedUsersQuery = `
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
  }`;
      tester.test(true, validNestedUsersQuery);
    });
  });

  describe('Should pass iff the nested user query is invalid.', () => {
    it('Is an invalid nested users query.', () => {
      const invalidNestedUsersQuery = `
  {
   users {
     id
     username
     invalidField
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
 }`;
      tester.test(false, invalidNestedUsersQuery);
    });
  });
});

describe('Create User Mutation', () => {
  it('createUser should return a properly shaped user object.', () => {
    const createUserMutation = `
       mutation createUser {
         createUser(data: 
          {
          username: "test",
          thirdPartyUID: "test",
          firebaseUID: "test",
          email: "test",
          userProfileImage: "test",
          bio: "test",
          privilege: "test",
          stripeId: "test",
          accountType: "test"
         })
         {
          id
          username
          thirdPartyUID
          firebaseUID
          email
          userProfileImage
          bio
          privilege
          stripeId
          accountType
         }
       }
      `;
    const tester = new EGQLT(schema);
    tester.test(true, createUserMutation, [
      {
        username: 'test',
        thirdPartyUID: 'test',
        firebaseUID: 'test',
        email: 'test',
        userProfileImage: 'test',
        bio: 'test',
        privilege: 'test',
        stripeId: 'test',
        accountType: 'test'
      }
    ]);
  });
});

describe('Delete User Mutation', () => {
  it('Should delete a user given unique input.', () => {
    const deleteUserMutation = `
   mutation deleteUser($username: String!) {
    deleteUser(where: {username: $username}) {
     username
     id
    }
   } 
  `;
    const username = {
      username: 'test'
    };
    const tester = new EGQLT(schema);
    const {
      data: { deleteUser }
    } = tester.mock({
      query: deleteUserMutation,
      variables: username
    });
  });
});

describe('Update User Mutation', () => {
  it('Should update a user given unique input.', () => {
    const updateUserMutation = ` 
   mutation updateUser(
    $username: String! 
    $email: String!) {
    updateUser(
     data: {
      username: $username 
      email: $email} 
      where: {username: $username email: $email}) {
     username
     email
    }
   }
  `;
    const updateInfo = {
      username: 'test',
      email: 'test@test.com'
    };
    const tester = new EGQLT(schema);
    const {
      data: { updateUser }
    } = tester.mock({
      query: updateUserMutation,
      variables: updateInfo
    });
  });
});
