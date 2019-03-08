const {GraphQLServer} = require('graphql-yoga');
//const { prisma } = require('./generated/prisma-client');
 const Mutation = require('./resolvers/Mutation');
 const Query = require('./resolvers/Query');
 const User = require('./resolvers/User');

 const resolvers = {
   Query,
   Mutation
 }



//context: { prisma },

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
});

server.start(() => console.log(`🚀 Server ready at 4000`));
