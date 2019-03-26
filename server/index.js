const path = require('path')
const { GraphQLServer } = require('graphql-yoga') 
const { makePrismaSchema, prismaObjectType } = require('nexus-prisma') 
const { prisma } = require('./src/generated/prisma-client') 
const datamodelInfo = require('./generated/nexus-prisma') 
const {stripe} = require('./src/stripe') 
const { stringArg } = require('nexus/dist/definitions/args') 


const Query = prismaObjectType({
  name: 'Query',
  definition(t) {t.prismaFields(['*'])}
})


const Mutation = prismaObjectType({
  name: 'Mutation',
  definition(t) {
    t.prismaFields(['*'])
    t.field("createSubscription", {
      type: "User",
      args: {
        source: stringArg()
      },
      resolve: async (parent, {source}, {req}, info) => {
        // if (!req.session || !req.session.userId) {
        //     throw new Error("not authenticated")
        // }/k
        // const user = await prisma.user({id: 1})

        const makeid = (length) => {
            let text = "";
            const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
          
            for (let i = 0; i < length; i++)
              text += possible.charAt(Math.floor(Math.random() * possible.length));
          
            return text;
          }

          const userName = makeid(8);
          const emailFront = makeid(5);
          const email = `${emailFront}@gmail.com`;
          const password = makeid(7);
          
        const newUser = await prisma.createUser({
                username: userName,
                email: email,
                password: password,
                privilege: "basic"
            
        })
        const user = await prisma.user({username: userName})
        const customer = await stripe.customers.create({
            email: user.email,
            source,
            plan: "plan_EgOcH41cdoNcdA"
        });
        
        const updatingUser = await prisma.updateUser({
            where: {id: user.id},
            data: {
                stripeId: customer.id,
                accountType: "standard-tier"
            }
        })
        const updatedUser = await prisma.user({username: userName})
        
        return updatedUser;
    }
    }) 

    }
})

const schema = makePrismaSchema({
  types: [Query, Mutation],

  prisma: {
    datamodelInfo,
    client: prisma
  },

  outputs: {
    schema: path.join(__dirname, './generated/schema.graphql'),
    typegen: path.join(__dirname, './generated/nexus.js'),
  },
})

const server = new GraphQLServer({
  schema,
  context: { prisma }
})
server.start(() => console.log(`Server is running on http://localhost:4000`))


