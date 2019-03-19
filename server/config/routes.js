const axios = require('axios');

module.exports = server => {
   server.get('/', helloWorld);
}

const helloWorld = (req, res) => {
    res.json({ message: 'Hello world' });
}