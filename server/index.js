const path = require('path');
const { ApolloServer } = require('apollo-server')
import { GraphQLServer } from 'graphql-yoga'
require('dotenv').config()
const { makePrismaSchema, prismaObjectType } = require('nexus-prisma');
const { prisma } = require('./src/generated/prisma-client');
const datamodelInfo = require('./src/generated/nexus-prisma');
const { stripe } = require('./src/stripe');
const { stringArg, idArg, intArg, booleanArg } = require('nexus');
const nodemailer = require('nodemailer');
const pug = require('pug');

let transporter = nodemailer.createTransport({
  service: process.env.NM_SERVICE,
  auth: {
    user: process.env.NM_USER, // generated ethereal user
    pass: process.env.NM_PW // generated ethereal password
  }
});

const Query = prismaObjectType({
  name: 'Query',
  definition(t) {
    t.prismaFields(['*']);
  }
});
const Mutation = prismaObjectType({
  name: 'Mutation',
  definition(t) {
    t.prismaFields(['*']);
    t.field('dislikeAReview', {
      type: 'Review',
      args: {
        revId: idArg(),
        username: stringArg(),
        didThumbDown: booleanArg()
      },
      resolve: async (parent, { revId, username, didThumbDown }, ctx, info) => {
        if (didThumbDown) {
          const review = await prisma.review({ id: revId });
          let thumbsDown = review.thumbsDown;
          thumbsDown -= 1;

          const updatedReview = await prisma.updateReview({
            data: { thumbsDown },
            where: { id: revId }
          });

          const updateUser = await prisma.updateUser({
            data: { LikedReviews: { disconnect: { id: revId } } },
            where: { username: username }
          });

          return updatedReview;
        } else {
          const review = await prisma.review({ id: revId });
          let thumbsDown = review.thumbsDown;
          thumbsDown += 1;
          const updatedReview = await prisma.updateReview({
            data: { thumbsDown },
            where: { id: revId }
          });

          const updateUser = await prisma.updateUser({
            data: { LikedReviews: { connect: { id: revId } } },
            where: { username: username }
          });

          return updatedReview;
        }
      }
    });
    t.field('likeAReview', {
      type: 'Review',
      args: {
        revId: idArg(),
        username: stringArg(),
        didThumbUp: booleanArg()
      },
      resolve: async (parent, { revId, username, didThumbUp }, ctx, info) => {
        if (didThumbUp) {
          const review = await prisma.review({ id: revId });
          let thumbsUp = review.thumbsUp;
          thumbsUp -= 1;

          const updatedReview = await prisma.updateReview({
            data: { thumbsUp },
            where: { id: revId }
          });

          const user = await prisma.updateUser({
            data: { LikedReviews: { disconnect: { id: revId } } },
            where: { username: username }
          });

          return updatedReview;
        } else {
          const review = await prisma.review({ id: revId });
          let thumbsUp = review.thumbsUp;
          thumbsUp += 1;

          const updatedReview = await prisma.updateReview({
            data: { thumbsUp },
            where: { id: revId }
          });

          const user = await prisma.updateUser({
            data: { LikedReviews: { connect: { id: revId } } },
            where: { username: username }
          });

          return updatedReview;
        }
      }
    });
    t.field('rateAProject', {
      type: 'Project',
      args: {
        rating: intArg(),
        id: idArg(),
        username: stringArg()
      },
      resolve: async (parent, { rating, id, username }, ctx, info) => {
        const project = await prisma.project({ id: id });
        let ratings = project.rating;
        ratings.push(rating);

        const updatedProject = await prisma.updateProject({
          data: { rating: { set: ratings } },
          where: { id }
        });

        const user = await prisma.updateUser({
          data: { RatedProjects: { connect: { id } } },
          where: { username }
        });

        return updatedProject;
      }
    });
    t.field('editUser', {
      type: 'User',
      args: {
        userProfileImage: stringArg(),
        bio: stringArg(),
        email: stringArg()
      },
      resolve: async (parent, { userProfileImage, bio, email }, ctx, info) => {
        const updatedUser = await prisma.updateUser({
          data: { userProfileImage, bio },
          where: { email }
        });
        return updatedUser;
      }
    });
    t.field('newUser', {
      type: 'User',
      args: {
        username: stringArg(),
        email: stringArg(),
        firebaseUID: stringArg()
      },
      resolve: async (parent, { username, email, firebaseUID }, ctx, info) => {
        const compiledFunction = pug.compileFile('./templates/newUser.pug');
        const avatars = [
          'https://res.cloudinary.com/dv1rhurfd/image/upload/v1555353676/avatars/avatar-6.png',
          'https://res.cloudinary.com/dv1rhurfd/image/upload/v1555353676/avatars/avatar-7.png',
          'https://res.cloudinary.com/dv1rhurfd/image/upload/v1555353675/avatars/avatar-14.png',
          'https://res.cloudinary.com/dv1rhurfd/image/upload/v1555353675/avatars/avatar-15.png',
          'https://res.cloudinary.com/dv1rhurfd/image/upload/v1555353675/avatars/avatar-5.png',
          'https://res.cloudinary.com/dv1rhurfd/image/upload/v1555353675/avatars/avatar-3.png',
          'https://res.cloudinary.com/dv1rhurfd/image/upload/v1555353675/avatars/avatar-12.png',
          'https://res.cloudinary.com/dv1rhurfd/image/upload/v1555353675/avatars/avatar-13.png',
          'https://res.cloudinary.com/dv1rhurfd/image/upload/v1555353675/avatars/avatar-11.png',
          'https://res.cloudinary.com/dv1rhurfd/image/upload/v1555353675/avatars/avatar-4.png',
          'https://res.cloudinary.com/dv1rhurfd/image/upload/v1555353675/avatars/avatar.png',
          'https://res.cloudinary.com/dv1rhurfd/image/upload/v1555353675/avatars/avatar-2.png',
          'https://res.cloudinary.com/dv1rhurfd/image/upload/v1555353675/avatars/avatar-8.png',
          'https://res.cloudinary.com/dv1rhurfd/image/upload/v1555353675/avatars/avatar-10.png',
          'https://res.cloudinary.com/dv1rhurfd/image/upload/v1555353675/avatars/avatar-1.png',
          'https://res.cloudinary.com/dv1rhurfd/image/upload/v1555353675/avatars/avatar-9.png'
        ];
        let avatar = avatars[Math.floor(Math.random() * avatars.length)];
        const template = compiledFunction({
          username: username
        });
        mailOptions = {
          from: 'ratemydiyproject@gmail.com', // sender address
          to: email, // list of receivers
          subject: 'Welcome to Rate My DIY!', // Subject line
          html: template // plain text body
        };

        let user = await prisma.createUser({
          username,
          email,
          firebaseUID,
          userProfileImage: avatar
        });
        await transporter.sendMail(mailOptions, function(err, info) {
          if (err) console.log(err);
          else console.log(info);
        });
        return user;
      }
    });
    t.field('editReview', {
      type: 'Review',
      args: {
        name: stringArg(),
        text: stringArg(),
        timestamp: stringArg(),
        projId: idArg(),
        revId: idArg(),
        projRating: intArg()
      },
      resolve: async (
        parent,
        { name, text, timestamp, projId, revId, projRating },
        ctx,
        info
      ) => {
        if (projRating > 0) {
          const ratingProject = await prisma.project({ id: projId });
          let ratings = ratingProject.rating;
          ratings.push(projRating);

          const updateProj = await prisma.updateProject({
            data: { rating: { set: ratings } },
            where: { id: projId }
          });

          let review = await prisma.updateReview({
            data: {
              name,
              text,
              timestamp,
              projRating
            },
            where: { id: revId }
          });

          return review;
        } else {
          let review = await prisma.updateReview({
            data: {
              name,
              text,
              timestamp,
              projRating
            },
            where: { id: revId }
          });

          return review;
        }
      }
    });

    t.field('newReview', {
      type: 'Review',
      args: {
        name: stringArg(),
        text: stringArg(),
        timestamp: stringArg(),
        user: stringArg(),
        username: stringArg(),
        id: idArg(),
        projRating: intArg()
      },
      resolve: async (
        parent,
        { name, text, timestamp, username, user, id, projRating },
        ctx,
        info
      ) => {
        if (projRating > 0) {
          const ratingProject = await prisma.project({ id: id });
          let ratings = ratingProject.rating;
          ratings.push(projRating);

          const updateProj = await prisma.updateProject({
            data: { rating: { set: ratings } },
            where: { id }
          });

          const updateUser = await prisma.updateUser({
            data: { RatedProjects: { connect: { id } } },
            where: { username: username }
          });

          let project = await prisma.project({ id: id });
          let projectAuthor = await prisma.user({ username: user });
          const compiledFunction = pug.compileFile('./templates/newReview.pug');
          const template = compiledFunction({
            name: project.name
          });

          mailOptions = {
            from: 'ratemydiyproject@gmail.com', // sender address
            to: projectAuthor.email, // list of receivers
            subject: 'Your project has a new review!', // Subject line
            html: template // plain text body
          };

          let review = await prisma.createReview({
            name,
            text,
            timestamp,
            projRating,
            Author: {
              connect: { username }
            },
            ProjectReviewed: {
              connect: { id }
            }
          });
          await transporter.sendMail(mailOptions, function(err, info) {
            if (err) console.log(err);
            else console.log(info);
          });

          return review;
        } else {
          let project = await prisma.project({ id: id });
          let projectAuthor = await prisma.user({ username: user });
          const compiledFunction = pug.compileFile('./templates/newReview.pug');
          const template = compiledFunction({
            name: project.name
          });

          mailOptions = {
            from: 'ratemydiyproject@gmail.com', // sender address
            to: projectAuthor.email, // list of receivers
            subject: 'Your project has a new review!', // Subject line
            html: template // plain text body
          };

          let review = await prisma.createReview({
            name,
            text,
            timestamp,
            Author: {
              connect: { username }
            },
            ProjectReviewed: {
              connect: { id }
            }
          });
          await transporter.sendMail(mailOptions, function(err, info) {
            if (err) console.log(err);
            else console.log(info);
          });
          return review;
        }
      }
    });
    t.field('newProject', {
      type: 'Project',
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
        { name, category, timestamp, titleImg, titleBlurb, steps, username },
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
          rating: { set: [1] },
          User: { connect: { username } }
        });
      }
    });
    t.field('editProject', {
      type: 'Project',
      args: {
        name: stringArg(),
        category: stringArg(),
        timestamp: stringArg(),
        titleImg: stringArg(),
        titleBlurb: stringArg(),
        steps: stringArg(),
        username: stringArg(),
        id: idArg()
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
          username,
          id
        },
        ctx,
        info
      ) => {
        return prisma.updateProject({
          data: {
            name,
            category,
            timestamp,
            titleImg,
            titleBlurb,
            steps,
            User: { connect: { username } }
          },
          where: { id: id }
        });
      }
    });
    t.field('firebaseSignUp', {
      type: 'User',
      args: {
        username: stringArg(),
        email: stringArg(),
        thirdPartyUID: stringArg()
      },
      resolve: async (
        parent,
        { username, email, thirdPartyUID },
        ctx,
        info
      ) => {
        const avatars = [
          'https://res.cloudinary.com/dv1rhurfd/image/upload/v1555353676/avatars/avatar-6.png',
          'https://res.cloudinary.com/dv1rhurfd/image/upload/v1555353676/avatars/avatar-7.png',
          'https://res.cloudinary.com/dv1rhurfd/image/upload/v1555353675/avatars/avatar-14.png',
          'https://res.cloudinary.com/dv1rhurfd/image/upload/v1555353675/avatars/avatar-15.png',
          'https://res.cloudinary.com/dv1rhurfd/image/upload/v1555353675/avatars/avatar-5.png',
          'https://res.cloudinary.com/dv1rhurfd/image/upload/v1555353675/avatars/avatar-3.png',
          'https://res.cloudinary.com/dv1rhurfd/image/upload/v1555353675/avatars/avatar-12.png',
          'https://res.cloudinary.com/dv1rhurfd/image/upload/v1555353675/avatars/avatar-13.png',
          'https://res.cloudinary.com/dv1rhurfd/image/upload/v1555353675/avatars/avatar-11.png',
          'https://res.cloudinary.com/dv1rhurfd/image/upload/v1555353675/avatars/avatar-4.png',
          'https://res.cloudinary.com/dv1rhurfd/image/upload/v1555353675/avatars/avatar.png',
          'https://res.cloudinary.com/dv1rhurfd/image/upload/v1555353675/avatars/avatar-2.png',
          'https://res.cloudinary.com/dv1rhurfd/image/upload/v1555353675/avatars/avatar-8.png',
          'https://res.cloudinary.com/dv1rhurfd/image/upload/v1555353675/avatars/avatar-10.png',
          'https://res.cloudinary.com/dv1rhurfd/image/upload/v1555353675/avatars/avatar-1.png',
          'https://res.cloudinary.com/dv1rhurfd/image/upload/v1555353675/avatars/avatar-9.png'
        ];
        let avatar = avatars[Math.floor(Math.random() * avatars.length)];
        const compiledFunction = pug.compileFile('./templates/newUser.pug');
        const template = compiledFunction({
          name: username
        });
        mailOptions = {
          from: 'ratemydiyproject@gmail.com', // sender address
          to: email, // list of receivers
          subject: 'Welcome to Rate My DIY!', // Subject line
          html: template // plain text body
        };

        let user = await prisma.upsertUser({
          where: { username },
          create: {
            username,
            email,
            thirdPartyUID,
            userProfileImage: avatar
          },
          update: {
            email,
            thirdPartyUID
          }
        });
        await transporter.sendMail(mailOptions, function(err, info) {
          if (err) console.log(err);
          else console.log(info);
        });
        return user;
      }
    });
    t.field('createSubscription', {
      type: 'User',
      args: {
        source: stringArg(),
        email: stringArg()
      },
      resolve: async (parent, args, { req }, info) => {
        const customer = await stripe.customers.create({
          email: args.email,
          source: args.source,
          plan: 'plan_EgOcH41cdoNcdA'
        });

        const updatingUser = await prisma.updateUser({
          where: { email: args.email },
          data: {
            stripeId: customer.id,
            accountType: 'standard-tier'
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
      './src/generated/prisma-client/schema.graphql'
    ),
    typegen: path.join(__dirname, './src/generated/nexus.js')
  }
});

const server = new GraphQLServer({
  schema,
  context: { prisma },
  debug: true
});
server.start(() => console.log(`Server is running on http://localhost:4000`));
