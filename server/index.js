const {GraphQLServer} = require('graphql-yoga');
const {Prisma} = require('prisma-binding');
require("dotenv/config");
const { prisma } = require('./src/generated/prisma-client');
 const Mutation = require('./src/resolvers/Mutation');
 const Query = require('./src/resolvers/Query');
 const User = require('./src/resolvers/User');
//  import {stripe} from '../stripe';

 const resolvers = {
   Query,
   Mutation,
 }
  
  const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: ({ req }) => ({
      request: req,
      prisma
    }),
    introspection: true,
    playground: true
});


server.start(() => 
  console.log(`🚀 Server ready at port:4000`)
);