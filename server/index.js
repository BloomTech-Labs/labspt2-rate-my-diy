const {GraphQLServer} = require('graphql-yoga');
const {Prisma} = require('prisma-binding');
const {config} = require('dotenv');
// const { prisma } = require('./src/generated/prisma-client');
// const { importSchema } = require('graphql-import');
// const { makeExecutableSchema,
//   addMockFunctionsToSchema,
//   mergeSchemas } = require('graphql-tools');
const Mutation = require('./src/resolvers/Mutation');
 const Query = require('./src/resolvers/Query');
 const User = require('./src/resolvers/User');




 const resolvers = {
  //  Query,
   Mutation
 }

//  const gqlTypeDefs = importSchema('src/schema.graphql');
//  const prismaTypeDefs = importSchema('src/generated/prisma-client/prisma.graphql');

//  const gqlSchema = makeExecutableSchema({
//   typeDefs: gqlTypeDefs
// });

// addMockFunctionsToSchema({ schema: gqlSchema });

// const prismaSchema = makeExecutableSchema({
//   typeDefs: prismaTypeDefs
// });

// addMockFunctionsToSchema({ schema: prismaSchema });

// const schema = mergeSchemas({
//   schemas: [
//     gqlSchema,
//     prismaSchema,
//   ],
//   resolvers
// });

 
//  const server = new GraphQLServer({
//   schema,
//   context: req => ({
//     ...req,
//     db: new Prisma({
//       typeDefs: prismaTypeDefs,
//       endpoint: 'https://ratemydiy-6af9c6a6b8.herokuapp.com/ratemydiy/dev',
//     })
//   }),
// })

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