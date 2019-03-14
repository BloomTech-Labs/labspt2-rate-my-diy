const { prisma } = require('../generated/prisma-client/');
const {stripe} = require("../stripe");
const Mutation = {
    createUser: async (parent, args, context, info) => {
        const user = await prisma.createUser({
            username: args.username,
            email: args.email,
            password: args.password
        })
    },
    createSubscription: async (parent, {source}, {req}, info) => {
        // if (!req.session || !req.session.userId) {
        //     throw new Error("not authenticated")
        // }
        const user = await prisma.user({where: {id: 1}})
        const customer = await stripe.customers.create({
            email: user.email,
            source,
            plan: process.env.STRIPE_PLAN_ID
        });
        const updatingUser = await prisma.updateUser({
            where: {id: user.id},
            data: {
                stripeId: customer.id,
                type: "standard-tier"
            }
        })
        const updatedUser = await prisma.user({id: 1})
        
        return updatedUser;
    }
}

module.exports = Mutation