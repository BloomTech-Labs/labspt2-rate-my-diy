const path = require("path");
const { GraphQLServer } = require("graphql-yoga");
const { makePrismaSchema, prismaObjectType } = require("nexus-prisma");
const { unionType } = require("nexus");
const { prisma } = require("./src/generated/prisma-client");
const datamodelInfo = require("./src/generated/nexus-prisma");
const { stripe } = require("./src/stripe");
const { stringArg } = require("nexus/dist/definitions/args");
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
        const updatedUser = await prisma.user({email: args.email });

        return updatedUser;
      }
    });
  }
});
const Subscription = prismaObjectType({
  name: "Subscription",
  name: "User",
  definition(t) {
    t.prismaFields(["*"]);

    function newWelcomeEmail(parent, args, ctx, info) {
      return ctx.prisma.$subscribe.createUser({
        mutation_in: ["CREATED"].node()
      });
    }
    welcomeEmail = {
      subscribe: newWelcomeEmail,
      resolve: (parent, args, ctx, info) => {
        email = args.email;
        username = args.username ;
        const mailOptions = {
          from: "ratemydiyproject@gmail.com", // sender address
          to: email, // list of receivers
          subject: "Welcome to the Rate My DIY Community", // Subject line
          html:
            `<p>Welcome to Rate My Diy, ${username}. We hope you enjoy your visit here, if we can help you at all let us know!!</p>` // plain text body
        };
        transporter.sendMail(mailOptions, function(err, info) {
          if (err) console.log(err);
          else console.log(info);
        });
      }
    };
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
