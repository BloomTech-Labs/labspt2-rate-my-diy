const {GraphQLServer} = require('graphql-yoga');
const { prisma } = require('../generated/prisma-client/');
 const Mutation = require('./resolvers/Mutation');
 const Query = require('./resolvers/Query');
 const User = require('./resolvers/User');

 const resolvers = {
   Query,
   Mutation
 }



 
 const options = {
   port: 4466,
   endpoint: '/graphql'
  }
  
  const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: { prisma },
});

server.start(options, ({ port }) => 
  console.log(`🚀 Server ready at ${port}`)
);
