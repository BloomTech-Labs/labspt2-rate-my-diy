 const info = () => {
  return `This is a great app for DIY Reviews`
}

const getUsers = (parent, args, context) => {
  return context.prisma.users()
}

module.exports = {
  info,
  getUsers,
}