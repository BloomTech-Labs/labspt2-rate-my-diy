const { prisma } = require('../generated/prisma-client/');

const Query = {
  info: () => {
    return `This is a great app for DIY Reviews`
  }
}


module.exports = Query