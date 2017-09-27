import { GraphQLObjectType } from 'graphql';
import { nodeField } from '../nodes.js';
import { publication, publications } from './publication.js';

export default new GraphQLObjectType({
  name: 'Query',
  fields: {
    node: nodeField,
    ...publication,
    ...publications
  }
});
