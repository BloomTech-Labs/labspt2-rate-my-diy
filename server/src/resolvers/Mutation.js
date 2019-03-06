const users = require("../dummy-data/dummy.json")

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