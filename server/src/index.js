const {GraphQLServer} = require('graphql-yoga');
//const { prisma } = require('./generated/prisma-client');
// const Mutation = require('./resolvers/Mutation');
// const Query = require('./resolvers/Query');
// const User = require('./resolvers/User');

//This needs work because errors are popping up
// const resolvers = {
//   Mutation,
//   Query,
//   User
// }

const resolvers = {
  Query: {
    info: () => 'This is a great app for DIY Reviews',
  },
}

//context: { prisma },

const server = new GraphQLServer({
  typeDefs: './src/schema.1.graphql',
  resolvers,
  
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});