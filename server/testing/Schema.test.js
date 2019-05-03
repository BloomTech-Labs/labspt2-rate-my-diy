import { 
 makeExecutableSchema,
 addMockFunctionsToSchema,
 mockServer,

} from 'graphql-tools'

const testCaseA = {
 id: 'Test Case A',
 query: `
  query {
   projects {
    name
    category
    titleImg
    titleBlurb
    steps
   }
  }`,
  variables: {},
  context: {},
  expected: {}
};

const testCaseB = {
 id: 'Test Case B',
 query: `
  query {
   users {
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
  }`,
  variables: {},
  context: {},
  expected: {}
};

const testCaseC = {
 id: 'Test Case C',
 query: `
  query {
   reviews {
    name
    rKey
    projRating
    thumbsUp
    thumbsDown
   }
  }`,
  variables: {},
  context: {},
  expected: {}
};

describe('Schema', () => {
 const cases = [testCaseA, testCaseB, testCaseC];

 const mockSchema = makeExecutableSchema({ typeDefs });
 
 addMockFunctionsToSchema({
  schema: mockSchema,
  mocks: {
   Boolean: () => false,
   ID: () => '1',
   Int: () => 1,
   Float: () => 12.34,
   String: () => 'Dog'
  }
 });

 test('has correct type definitions', async () => {
  expect(async () => {
   const MockServer = mockServer(typeDefs);
   
   await MockServer.query(`{ __schema { types { name } } }`)
  }).not.toThrow()
 })

 cases.forEach((obj) => {
  const { id, query, variables, context: ctx, expected} = obj;

  test(`query: ${id}`, async () => {
   return await expect(
    graphql(mockSchema, query, null, { ctx }, variables)
   ).resolves.toEqual(expected)
  })
 })
})

// describe('Schema', () => {
//  const cases = [testCaseB]
// })

// describe('Schema', () => {
//  const cases = [testCaseC]
// })