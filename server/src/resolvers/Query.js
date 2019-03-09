 const info = () => {
  return `This is a great app for DIY Reviews`
}

const getUsers = (parent, args, context) => {
  return context.prisma.users()
}

const GetReviews = (parent,args,context) => {
  return context.prisma.reviews()
}

const getReviewById = (parents, args, context, info) => {
  return context.prisma.review({where: {id: args.id}}, info)
}

const getStars = (parents, args, context) => {
  return context.prisma.starses()
}

module.exports = {
  info,
  getUsers,
  GetReviews,
  getReviewById,
  getStars
}