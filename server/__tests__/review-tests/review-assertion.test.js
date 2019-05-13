'use strict';
const EGQLT = require('easygraphql-tester');
const fs = require('fs');
const path = require('path');
const { expect } = require('chai');
const schema = fs.readFileSync(
  path.join(__dirname, '..', '../../server/__tests__/mock-schema.graphql'),
  'utf8'
);

describe('Testing schema (Review), Query', () => {
  let tester;
  beforeAll(() => {
    tester = new EGQLT(schema);
  });

  describe('Should pass if the root level review query is valid.', () => {
    it('Is a valid reviews query', () => {
      const validQuery = `
   {
    reviews {
     id
     name
     rKey
     text
     timestamp
     thumbsUp
     thumbsDown
    }
   }
   `;
      tester.test(true, validQuery);
    });
  });

  describe('Should pass if the root level review query is invalid.', () => {
    it('Is an invalid reviews query.', () => {
      const invalidQuery = `
   {
    reviews {
     id
     name
     rKey
     invalidField
     text
     timestamp
     thumbsUp
     thumbsDown
    }
   }
   `;
      tester.test(false, invalidQuery);
    });
  });
  // describe('Should pass if the nested review query is valid', () => {
  //   it('Is a valid nested review query.', () => {
  //     {
  //       re;
  //     }
  //   });
  // });
});
