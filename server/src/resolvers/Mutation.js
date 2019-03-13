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
        const user = await prisma.getUserById({id: 1})
        const customer = await stripe.customers.create({
            email: user.email,
            source,
            plan: process.env.STRIPE_PLAN_ID
        });
        user.stripeId = customer.id;
        user.type = "standard";
        await user.save();
        return user;
    }
}

module.exports = Mutation