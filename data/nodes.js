import { fromGlobalId, nodeDefinitions } from 'graphql-relay';
import { publicationModel, getPublication } from './models/publicationModel.js';
import { publicationType } from './types/publicationType.js';

// nodeDefinitions returns a nodeInterface that a GraphQL Object can implement.
// It also returns a node root field that can be included in a query.
// We are exporting nodeInterface and nodeField
// nodeDefinitions have a function to resolve globalId and determine type of  object as defined in GraphQL.


const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, _id } = fromGlobalId(globalId);
    if (type === 'Publication') {
      return getPublication();
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj instanceof publicationModel) {
      return publicationType;
    } else {
      return null;
    }
  }
);

module.exports = { nodeInterface, nodeField };
