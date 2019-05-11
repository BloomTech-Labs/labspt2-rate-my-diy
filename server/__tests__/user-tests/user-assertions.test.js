'use strict';
const EGQLT = require('easygraphql-tester');
const fs = require('fs');
const path = require('path');

const { expect } = require('chai');
const schema = fs.readFileSync(
  path.join(__dirname, '..', '../../server/__tests__/mock-schema.graphql'),
  'utf8'
);

describe('Testing schema, Query', () => {
  let tester;
  beforeAll(() => {
    tester = new EGQLT(schema);
  });
  describe('Should pass if the root level query is valid.', () => {
    it('Valid query getUsers', () => {
      const validQuery = `
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
      tester.test(true, validQuery);
    });
  });
  describe('Should pass if the root level query is invalid', () => {
    it('Invalid query getUsers', () => {
      const invalidQuery = `
     {
      getUsers {
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
      tester.test(false, invalidQuery);
    });
  });
});
