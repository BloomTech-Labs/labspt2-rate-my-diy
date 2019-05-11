'use strict';
const EGQLT = require('easygraphql-tester');
const fs = require('fs');
const path = require('path');
const { expect } = require('chai');
const schema = fs.readFileSync(
  path.join(__dirname, '..', '.schema.graphql'),
  'utf8'
);

describe('Testing schema, Query', () => {
  tester: beforeAll(() => {
    tester: new EGQLT(schema);
  });

  describe('Queries', () => {
    test('Should pass with multiple queries', () => {
      const userQuery = `
    $id: ID!
    $username: String!
    $bio: String!
    $email: String!
    $account: String @default(value: 'free-tier)
   `;
      tester.test(true, userQuery, {
        id: 'cjunieium00u50765xx6b78i5'
      });
    });

    test('Should return an object.', () => {
      let error;
      try {
        const query = `
    $id: ID!
    $username: String!
    $bio: String!
    $email: String!
    $account: String @default(value: 'free-tier)
   `;
        tester.mock({
          query,
          variables: {
            id: 'cjunieium00u50765xx6b78i5'
          }
        });
      } catch (err) {
        error = err;
      }
      expect(error).to.exist;
    });
  });
});
