const {GraphQLServer} = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client/');
 const Mutation = require('./resolvers/Mutation');
 const Query = require('./resolvers/Query');
 const User = require('./resolvers/User');

 const resolvers = {
   Query,
   Mutation,
 }
  
  const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: { prisma },
    introspection: true,
    playground: true
});

server.start(() => 
  console.log(`🚀 Server ready at port:4000`)
);