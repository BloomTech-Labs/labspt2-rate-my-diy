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
                password: password
            
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
}

module.exports = Mutation