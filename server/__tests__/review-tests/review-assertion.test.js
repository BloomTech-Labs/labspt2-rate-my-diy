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

  describe('Should pass if the root level reviews query is valid.', () => {
    it('Is a valid reviews query', () => {
      const validReviewsQuery = `
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
      tester.test(true, validReviewsQuery);
    });
  });

  describe('Should pass if the root level reviews query is invalid.', () => {
    it('Is an invalid reviews query.', () => {
      const invalidReviewsQuery = `
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
      tester.test(false, invalidReviewsQuery);
    });
  });

  describe('Should pass if the root level review query is valid.', () => {
    it('Is a valid reviews query', () => {
      const validReviewQuery = `
  {
   review(where: {id: "test"}) {
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

      const reviewFixture = {
        data: {
          review: {
            id: 'test',
            name: 'test',
            rKey: 'test',
            timestamp: 'test',
            thumbsUp: 0,
            thumbsDown: 0
          }
        }
      };
      const {
        data: { review }
      } = tester.mock({
        query: validReviewQuery,
        variables: reviewFixture,
        validateDeprecated: true
      });
    });
  });

  describe('Should pass if the root level review query is invalid.', () => {
    it('Is an invalid review query', () => {
      const invalidReviewQuery = `
    {
     review(where: {id: "test"}) {
      id
      name
      rKey
      timestamp
      invalidField
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
  describe('Should pass if the nested reviews query is invalid', () => {
    it('Is an invalid nested review query.', () => {
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

  describe('Should pass if the nested review query is invalid', () => {
    it('Is an invalid nested review query.', () => {
      const invalidNestedReviewQuery = `
  { review
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

describe('Delete Review Mutation', () => {
  it('Should delete a review given unique input.', () => {
    const deleteReviewMutation = `
   mutation deleteReview($rKey: String!) {
    deleteReview(where: {rKey: $rKey}) {
     name
     text
    }
   }
  `;
    const rKey = {
      rKey: 'test'
    };
    const tester = new EGQLT(schema);

    const {
      data: { deleteReview }
    } = tester.mock({
      query: deleteReviewMutation,
      variables: rKey
    });
  });
});

describe('Update Review Mutation', () => {
  it('Should update a review given unique input.', () => {
    const updateReviewMutation = `
   mutation updateReview(
    $rKey: String!
    $name: String!
    $text: String!
   ) {
    updateReview(
     data: {
      name: $name
      text: $text
     }
     where: {rKey: $rKey}) {
      name
      text
     }
   }
  `;
    const updateReviewInfo = {
      name: 'test',
      text: 'test',
      rKey: 'test'
    };

    const tester = new EGQLT(schema);
    const {
      data: { updateReview }
    } = tester.mock({
      query: updateReviewMutation,
      variables: updateReviewInfo
    });
  });
});
