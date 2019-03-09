const { prisma } = require('../generated/prisma-client/');

const Mutation = {
    createUser: async (parent, args, info) => {
        const user = await prisma.createUser({
            username: args.username,
            email: args.email,
            password: args.password
        })
    }
}

module.exports = Mutation