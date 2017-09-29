import { GraphQLSchema } from 'graphql';
import queries from './queries';

export const Schema = new GraphQLSchema({
  query: queries
});
