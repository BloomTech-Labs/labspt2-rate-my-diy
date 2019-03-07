const {GraphQLServer} = require('graphql-yoga');
//const { prisma } = require('./generated/prisma-client');
 const Mutation = require('./resolvers/Mutation');
 const Query = require('./resolvers/Query');
 const User = require('./resolvers/User');

 const resolvers = {
   Query,
 }



//context: { prisma },

const server = new GraphQLServer({
  typeDefs: './src/schema.1.graphql',
  resolvers,
});

const options = {
	port: 4000,
	endpoint: '/graphql'
};

server.start(options, ({ port }) =>
  console.log(`🚀 Server ready at ${port}`)
);