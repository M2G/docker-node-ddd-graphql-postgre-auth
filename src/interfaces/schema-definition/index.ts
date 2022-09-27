import authenticate from 'interfaces/http/modules/authenticate';
import register from 'interfaces/http/modules/register';
import users from 'interfaces/http/modules/users';
// SCHEMA DEFINITIONS AND RESOLVERS

export default () => {
  const {
    resolvers: authenticateResolvers,
    typeDefs: authenticateTypeDefs,
} = authenticate().authenticate;

  const {
    resolvers: registerResolvers,
    typeDefs: registerTypeDefs,
  } = register().register;

  const {
    resolvers: usersResolvers,
    typeDefs: usersTypeDefs,
  } = users().users;

    return {
    resolvers: {
      ...authenticateResolvers.Type,
      ...registerResolvers.Type,
      Mutation: {
        ...authenticateResolvers.Mutation,
        ...registerResolvers.Mutation,
      },
      Query: {
        ...usersResolvers.Query,
      },
    },
      typeDefs: [
        authenticateTypeDefs,
        registerTypeDefs,
        usersTypeDefs,
      ],
  };
};
