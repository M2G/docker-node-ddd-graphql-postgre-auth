import { gql } from 'apollo-server-express';
import authenticate from 'interfaces/http/modules/authenticate';
import register from 'interfaces/http/modules/register';
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

  const {
    resolvers: registerResolvers,
    typeDefs: registerTypeDefs,
  } = register().register;

    return {
    resolvers: {
      ...authenticateResolvers.Type,
      ...registerResolvers.Type,

      /* Query: {
        ...authorResolvers.Query,
        ...bookResolvers.Query,
        ...commentResolvers.Query,
      }, */
      Mutation: {
        ...authenticateResolvers.Mutation,
        ...registerResolvers.Mutation,
        // ...bookResolvers.Mutation,
        // ...commentResolvers.Mutation,
      },
      Query: {},
    },
      typeDefs: [
        RootTypes,
        authenticateTypeDefs,
        registerTypeDefs,
      ],
  };
};
