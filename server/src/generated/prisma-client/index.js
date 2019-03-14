"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "Privileges",
    embedded: false
  },
  {
    name: "User",
    embedded: false
  },
  {
    name: "StepArray",
    embedded: false
  },
  {
    name: "Project",
    embedded: false
  },
  {
    name: "Review",
    embedded: false
  },
  {
    name: "Comment",
    embedded: false
  },
  {
    name: "Privilege",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `https://us1.prisma.sh/angelina-la-salle/server/dev`
});
exports.prisma = new exports.Prisma();
