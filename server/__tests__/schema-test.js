'use strict';
const EGQLT = require('easygraphql-tester');
const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require('graphql');
const fs = require('fs');
const path = require('path');
const schema = fs.readFileSync(
  path.join(__dirname, 'schema', 'schema.graphql'),
  'utf8'
);
const tester = new EGQLT(schema);
