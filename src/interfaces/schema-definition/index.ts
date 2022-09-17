import { gql } from 'apollo-server-express';
// SCHEMA DEFINITIONS AND RESOLVERS
import { typeDefs, resolvers } from './authenticate';

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

export default ({ ...arg }) => {
  console.log('zzzzzzzzzzzzzzzzzzzzz', { ...arg });
  return {
  typeDefs: [
    RootTypes, typeDefs,
  ],
  resolvers: {
    // ...authorResolvers.Type,
    /* Query: {
      ...authorResolvers.Query,
      ...bookResolvers.Query,
      ...commentResolvers.Query,
    }, */
    Mutation: {
      // ...authorResolvers.Mutation,
      // ...bookResolvers.Mutation,
      // ...commentResolvers.Mutation,
    },
  },
};
};
