
// //  createSubscription(source: String!): User!

import * as path from 'path'
import { GraphQLServer } from 'graphql-yoga'
import { makePrismaSchema, prismaObjectType } from 'nexus-prisma'
import { prisma } from './src/generated/prisma-client'
import datamodelInfo from './src/generated/nexus-prisma'
import {stripe} from './src/stripe'
import { stringArg, arg } from 'nexus/dist/definitions/args';
import { StripeResource } from 'stripe';

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

        const makeid = (length: number) => {
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
                Privilege: "basic"
            
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
    typegen: path.join(__dirname, './generated/nexus.ts'),
  },
})

const server = new GraphQLServer({
  schema,
  context: { prisma }
})
server.start(() => console.log(`Server is running on http://localhost:4000`))


