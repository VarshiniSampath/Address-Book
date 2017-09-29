import { GraphQLList, GraphQLString } from 'graphql';
import { publicationType } from '../types/publicationType.js';
import { getPublications, getPublication } from '../models/publicationModel.js';

const multiple = {
  type: new GraphQLList(publicationType),
    resolve: async() => {
      console.log('publication.js: multiple');
      return await getPublications();
    }
};

const single = {
  type: publicationType,
  resolve: async () => {
    console.log('publication.js: single');
    return await getPublication();
  }
}

export default {
  publications: multiple,
  publication: single,
};
