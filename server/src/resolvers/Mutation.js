const { prisma } = require('../generated/prisma-client/');
const {stripe} = require("../stripe");
const Mutation = {
    createUser: async (parent, args, context, info) => {
        const user = await prisma.createUser({
            username: args.username,
            email: args.email,
            password: args.password,
            stripeId: "",
            accountType: "free-tier"
        })
    },
    createSubscription: async (parent, {source}, {req}, info) => {
        // if (!req.session || !req.session.userId) {
        //     throw new Error("not authenticated")
        // }
        // const user = await prisma.user({id: 1})
        const newUser = await prisma.createUser({
                username: "blah",
                email: "abg@gmail.com",
                password: "jgvds"
            
        })
        const user = await prisma.user({username: "new"})
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
        const updatedUser = await prisma.user({username: "new"})
        
        return updatedUser;
    },

    createProject: async (parent, args, context, info) => {
        const project = await prisma.createProject({
            titleBlurb: args.titleBlurb,
            name: args.name,
            timestamp: args.timestamp,
            rating: args.rating,
            titleImg: args.titleImg,
            category: args.category,
			authorName: args.authorName
        });
    }
}

module.exports = Mutation