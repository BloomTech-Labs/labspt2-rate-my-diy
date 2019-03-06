const users = require("../dummy-data/dummy.json")
//Created mutation createUser

const createUser = (parent, args) => {
    const user = {
        id: args.id,
        username: args.username,
        email: args.email,
        password: args.password
    }

    users.push(user);

    return user;
}