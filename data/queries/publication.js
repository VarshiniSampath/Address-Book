import { GraphQLList, GraphQLString } from 'graphql';
import { publicationType } from '../types/publicationType.js';

const multiple = {
  type: new GraphQLList(publicationType),
    resolve: async() => {
      return await getPublications();
    }
};

const single = {
  type: publicationType,
  args: {
    id: { type: GraphQLString }
  },
  resolve: async () => {
    return await getPublicationByDOI(id);
  }
}

export default {
  publications: multiple,
  publication: single
};
