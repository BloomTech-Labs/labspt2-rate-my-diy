const users = require("../dummy-data/dummy.json")

const createUser = (parent, args, context) => {
 return context.prisma.createUser({
  username: args.username,
  email: args.email,
  password: args.password

 })
}

module.exports = {
    createUser,
}