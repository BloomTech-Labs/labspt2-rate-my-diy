const {GraphQLServer} = require('graphql-yoga');
const {config} = require('dotenv');
const { prisma } = require('./src/generated/prisma-client');
const { importSchema } = require('graphql-import');
const { makeExecutableSchema,
  addMockFunctionsToSchema,
  mergeSchemas, } = require('graphql-tools');
const Mutation = require('./src/resolvers/Mutation');
 const Query = require('./src/resolvers/Query');
 const User = require('./src/resolvers/User');




 const resolvers = {
   Query,
   Mutation,
 }

 const gqlTypeDefs = importSchema('./src/schema.gaphql');
 const prismaTypeDefs = importSchema('./src/generated/prisma-client/prisma.graphql');

 const gqlSchema = makeExecutableSchema({
  typeDefs: gqlTypeDefs
});

addMockFunctionsToSchema({ schema: gqlSchema });

const prismaSchema = makeExecutableSchema({
  typeDefs: prismaTypeDefs
});

addMockFunctionsToSchema({ schema: prismaSchema });

const schema = mergeSchemas({
  schemas: [
    gqlSchema,
    prismaSchema,
  ],
  resolvers
});

 
 const server = new GraphQLServer({
  schema,
  context: req => ({
    ...req,
    prisma
    // db: new Prisma({
    //   typeDefs: prismaTypeDefs,
    //   endpoint: 'https://ratemydiy-afd5a3785b.herokuapp.com/labsRMD/dev',
    // })
  }),
})


server.start(() => 
  console.log(`🚀 Server ready at port:4000`)
);