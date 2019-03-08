const {GraphQLServer} = require('graphql-yoga');
const { prisma } = require('../generated/prisma-client/');
 const Mutation = require('./resolvers/Mutation');
 const Query = require('./resolvers/Query');
 const User = require('./resolvers/User');

 const resolvers = {
   Query,
   Mutation
 }



<<<<<<< HEAD
 
 const options = {
   port: 4466,
   endpoint: '/graphql'
  }
  
  const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: { prisma },
=======
//context: { prisma },

const options = {
  port: 4466,
  endpoint: '/graphql'
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  introspection: true,
  playground: true
>>>>>>> 4ddcb462663676cc0147e41f980fcecbd3cb2840
});

server.start(options, ({ port }) => 
  console.log(`🚀 Server ready at ${port}`)
);
// https://github.com/timanovsky/subdir-heroku-buildpack
// PROJECT_PATH