'use strict';
const EGQLT = require('easygraphql-tester');
const fs = require('fs');
const path = require('path');
const { expect } = require('chai');
const schema = fs.readFileSync(
  path.join(__dirname, '..', '../../server/__tests__/mock-schema.graphql'),
  'utf8'
);

describe('Testing schema (Project), Query', () => {
  let tester;
  beforeAll(() => {
    tester = new EGQLT(schema);
  });

  describe('Should pass if the root level project query is valid.', () => {
    it('Is a valid getProjects query.', () => {
      const validQuery = `
    {
     projects {
      id
      name
      key
      category
      timestamp
      titleImg
      titleBlurb
      rating
      steps
     }
    }
   `;
      tester.test(true, validQuery);
    });
  });

  describe('Should pass iff the root level project query is invalid', () => {
    it('Is an invalid getProjects query.', () => {
      const invalidQuery = `
    {
     projects {
      id 
      name
      key
      invalidField
      category
      timestamp
      titleImg
      titleBlurb
      rating
      steps
     }
    }
   `;
      tester.test(false, invalidQuery);
    });
  });

  describe();
});
