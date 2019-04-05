const path = require("path");
const { GraphQLServer } = require("graphql-yoga");
const { makePrismaSchema, prismaObjectType } = require("nexus-prisma");
const { unionType } = require("nexus");
const { prisma } = require("./src/generated/prisma-client");
const datamodelInfo = require("./src/generated/nexus-prisma");
const { stripe } = require("./src/stripe");
const { stringArg, idArg, intArg } = require("nexus");
const nodemailer = require("nodemailer");

async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let account = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ratemydiyproject@gmail.com", // generated ethereal user
      pass: "lambda123" // generated ethereal password
    }
  });
}

  const Query = prismaObjectType({
    name: "Query",
    definition(t) {
      t.prismaFields(["*"]);
    }
  });
  const Mutation = prismaObjectType({
    name: "Mutation",
    definition(t) {
      t.prismaFields(["*"]);
      t.field("dislikeAReview", {
        type: "Review",
        args: {
          id: idArg(),
          username: stringArg()
        },
        resolve: async (parent, {id, username}, ctx, info) => {
          const review = await prisma.review({id: id})
          let thumbsDown = review.thumbsDown
          thumbsDown += 1

          const updatedReview = await prisma.updateReview({data: {thumbsDown}, where: {id: id}})

          const user = await prisma.updateUser({data: {DisLikedReviews: {connect: {id}}}, where: {username: username}})

          return updatedReview
        }
      })
      t.field("likeAReview", {
        type: "Review",
        args: {
          id: idArg(),
          username: stringArg()
        },
        resolve: async (parent, {id, username}, ctx, info) => {
          const review = await prisma.review({id: id})
          let thumbsUp = review.thumbsUp
          thumbsUp += 1

          const updatedReview = await prisma.updateReview({data: {thumbsUp}, where: {id: id}})

          const user = await prisma.updateUser({data: {LikedReviews: {connect: {id}}}, where: {username: username}})

          return updatedReview
        }
      })
      t.field("rateAProject", {
        type: "Project",
        args: {
          rating: intArg(),
          id: idArg(),
          username: stringArg()
        },
        resolve: async (parent, {rating, id, username}, ctx, info) => {
          
            const project = await prisma.project({id: id})
            let ratings = project.rating
            ratings.push(rating)

            const updatedProject = await prisma.updateProject({data: {rating: ratings}, where: {id}})

            const user = await prisma.updateUser({data: {RatedProjects: {connect: {id}}}, where: {username}})

            return updatedProject
        }
      })
      t.field("newUser", {
        type: "User",
        args:{
          username: stringArg(),
          email: stringArg(),
        },
        resolve: (parent, {username, email}, ctx, info) => {
          mailOptions = {
            from: "ratemydiyproject@gmail.com", // sender address
            to: email, // list of receivers
            subject: "Welcome to Rate My DIY!", // Subject line
            html: "<p>Welcome, {`${username}`}! We hope you enjoy our site!</p>" // plain text body
          }
          return (
            prisma.createUser({
              username,
              email
            }),
            transporter.sendMail(mailOptions, function(err, info) {
              if (err) console.log(err);
              else console.log(info);
            })
          )
        }
      })
      t.field("newReview", {
        type: "Review",
        args: {
          name: stringArg(),
          text: stringArg(),
          timestamp: stringArg(),
          username: stringArg(),
          email: stringArg(),
          id: idArg()
        },
        resolve: (
          parent,
          { name, text, timestamp, username, email, id },
          ctx,
          info
        ) => {
          mailOptions = {
            from: "ratemydiyproject@gmail.com", // sender address
            to: email, // list of receivers
            subject: "Your project has a new review!", // Subject line
            html: "<p>Your project, {`${name}`}, has a new review!</p>" // plain text body
          };
          return (
            prisma.createReview({
              name,
              text,
              timestamp,
              Author: {
                connect: {username}
              },
              ProjectReviewed: {
                connect: {id}
              }
            }),
            transporter.sendMail(mailOptions, function(err, info) {
              if (err) console.log(err);
              else console.log(info);
            })
          );
        }
      });
      t.field("newProject", {
        type: "Project",
        args: {
          name: stringArg(),
          category: stringArg(),
          timestamp: stringArg(),
          titleImg: stringArg(),
          titleBlurb: stringArg(),
          steps: stringArg(),
          username: stringArg()
        },
        resolve: (
          parent,
          {
            name,
            category,
            timestamp,
            titleImg,
            titleBlurb,
            steps,
            User: { connect: {username}}
          },
          ctx,
          info
        ) => {
          return prisma.createProject({
            name,
            category,
            timestamp,
            titleImg,
            titleBlurb,
            steps,
            User: { connect: { username } }
          });
        }
      });
      t.field("firebaseSignUp", {
        type: "User",
        args: {
          username: stringArg(),
          email: stringArg(),
          thirdPartyUID: stringArg()
        },
        resolve: (parent, { username, email, thirdPartyUID }, ctx, info) => {
          return prisma.createUser({
            username,
            email,
            thirdPartyUID
          });
        }
      });
      t.field("createSubscription", {
        type: "User",
        args: {
          source: stringArg(),
          email: stringArg()
        },
        resolve: async (parent, args, { req }, info) => {
          const customer = await stripe.customers.create({
            email: args.email,
            source: args.source,
            plan: "plan_EgOcH41cdoNcdA"
          });

          const updatingUser = await prisma.updateUser({
            where: { email: args.email },
            data: {
              stripeId: customer.id,
              accountType: "standard-tier"
            }
          });
          const updatedUser = await prisma.user({ email: args.email });

          return updatedUser;
        }
      });
    }
  });


const schema = makePrismaSchema({
  types: [Query, Mutation],

  prisma: {
    datamodelInfo,
    client: prisma
  },

  outputs: {
    schema: path.join(
      __dirname,
      "./src/generated/prisma-client/schema.graphql"
    ),
    typegen: path.join(__dirname, "./src/generated/nexus.js")
  }
});

const server = new GraphQLServer({
  schema,
  context: { prisma },
  debug: true
});
server.start(() => console.log(`Server is running on http://localhost:4000`));
