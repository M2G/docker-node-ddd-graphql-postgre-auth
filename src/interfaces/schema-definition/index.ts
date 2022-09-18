import { gql } from 'apollo-server-express';
import authenticate from '../http/modules/authenticate';
// SCHEMA DEFINITIONS AND RESOLVERS

// DEFAULT EMPTY ROOT TYPES
const RootTypes = gql`
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
  type Subscription {
    _empty: String
  }
`;

export default () => {
  const {
    resolvers: authenticateResolvers,
    typeDefs: authenticateTypeDefs,
} = authenticate().authenticate;

  console.log('postUseCase', {
    authenticateTypeDefs,
    authenticateResolvers,
  });

    return {
    typeDefs: [
     RootTypes,
    ],
    resolvers: {
      ...authenticateResolvers.Type,

      /* Query: {
        ...authorResolvers.Query,
        ...bookResolvers.Query,
        ...commentResolvers.Query,
      }, */
      Mutation: {
        ...authenticateResolvers.Mutation,
        // ...bookResolvers.Mutation,
        // ...commentResolvers.Mutation,
      },
    },
  };
};
