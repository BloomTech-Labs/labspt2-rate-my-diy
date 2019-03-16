const {GraphQLServer} = require('graphql-yoga');
const {Prisma} = require('prisma-binding');
const {config} = require('dotenv');
const Mutation = require('./src/resolvers/Mutation');
 const Query = require('./src/resolvers/Query');
 const User = require('./src/resolvers/User');




 const resolvers = {
  //  Query,
   Mutation
 }

const server = new GraphQLServer({
  typeDefs: 'src/schema.graphql',
  resolvers,
  context: req => ({
      req,
      prisma: new Prisma({
          typeDefs: 'src/generated/prisma-client/prisma.graphql',
          endpoint: 'https://ratemydiy-6af9c6a6b8.herokuapp.com/ratemydiy/dev',
      }),
  }),
})


server.start(() => 
  console.log(`🚀 Server ready at port:4000`)
);