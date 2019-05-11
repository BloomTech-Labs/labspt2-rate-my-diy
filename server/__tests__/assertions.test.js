'use strict';
const EGQLT = require('easygraphql-tester');
const fs = require('fs');
const path = require('path');
const { expect } = require('chai');
const schema = fs.readFileSync(
  path.join(__dirname, '..', '.../../../schema.graphql'),
  'utf8'
);

describe('Testing schema, Query', () => {
  let tester;
  beforeAll(() => {
    tester = new EGQLT(schema);
  });
  describe('Should pass if the query is invalid', () => {
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
    });
  });
});
