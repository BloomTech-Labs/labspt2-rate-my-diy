const {GraphQLServer} = require('graphql-yoga');
//Added prisma
const { prisma } = require('./generated/prisma-client');
const Mutation = require('./resolvers/Mutation');
const Query = require('./resolvers/Query');
const User = require('./resolvers/User');

const resolvers = {
  Mutation,
  Query,
  User
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: { prisma },
})
server.start(() => console.log(`Server is running on http://localhost:4000`))