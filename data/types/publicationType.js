import { globalIdField } from 'graphql-relay';
import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQL } from 'graphql';
import { nodeInterface } from '../nodes.js';

const publicationType = new GraphQLObjectType({
  name: 'papers',
  description: 'A research publication',
  fields: () => ({
    id: globalIdField('papers'),
    doi: {
      type: GraphQLString,
      description: 'Digital Object Identifier'
    },
    author: {
      type: GraphQLString,
      description: 'The names of the authors'
    },
    title: {
      type: GraphQLString,
      description: 'Title of the paper'
    },
    year: {
      type: GraphQLInt,
      description: 'Year of publication of the paper'
    },
    citationCount: {
      type: GraphQLInt,
      description: 'Citation count of the paper'
    }
  }),
  interfaces: [nodeInterface]
});

module.exports = { publicationType };
