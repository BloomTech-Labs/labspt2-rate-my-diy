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
      const validReviewQuery = `
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
      tester.test(true, validReviewQuery);
    });
  });

  describe('Should pass if the root level review query is invalid.', () => {
    it('Is an invalid reviews query.', () => {
      const invalidReviewQuery = `
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
      tester.test(false, invalidReviewQuery);
    });
  });
  describe('Should pass if the nested review query is valid', () => {
    it('Is a valid nested review query.', () => {
      const validNestedReviewQuery = `
   { reviews 
    { id
     name
     rKey
     text
     timestamp
     thumbsUp
     thumbsDown
     LikedBy {
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
     DislikedBy {
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
     Author {
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
     ProjectReviewed {
      id
      name
      key
      category
      timestamp
      titleImg
      titleBlurb
      rating
      steps
     }}}
     `;
      tester.test(true, validNestedReviewQuery);
    });
  });
  describe('Should pass if the nested review query is valid', () => {
    it('Is a valid nested review query.', () => {
      const invalidNestedReviewQuery = `
   { reviews 
    { id
     name
     rKey
     text
     invalidField
     timestamp
     thumbsUp
     thumbsDown
     LikedBy {
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
     DislikedBy {
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
     Author {
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
     ProjectReviewed {
      id
      name
      key
      category
      timestamp
      titleImg
      titleBlurb
      rating
      steps
     }}}
     `;
      tester.test(false, invalidNestedReviewQuery);
    });
  });
});

describe('Create Review Mutation', () => {
  it('createReview should return a properly shaped review object,', () => {
    const createReviewMutation = `
   mutation createReview(
    $id: String!
    $name: String!
    $rKey: String
    $text: String!
    $timestamp: String!
    $thumbsUp: Int
    $thumbsDown: Int
   ) {
    createReview(data: {
     id: $id
     name: $name
     rKey: $rKey
     text: $text
     timestamp: $timestamp
     thumbsUp: $thumbsUp
     thumbsDown: $thumbsDown}
    ) {
     name
    }
   }
  `;
    const tester = new EGQLT(schema);
    const createReviewInfo = {
      id: 'test',
      name: 'test',
      rKey: 'test',
      text: 'test',
      timestamp: 'test',
      thumbsUp: 0,
      thumbsDown: 0
    };

    const {
      data: { createReview }
    } = tester.mock({
      query: createReviewMutation,
      variables: createReviewInfo
    });
  });
});
