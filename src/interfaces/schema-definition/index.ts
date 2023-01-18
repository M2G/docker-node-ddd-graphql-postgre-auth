import authenticate from 'interfaces/http/modules/authenticate';
import register from 'interfaces/http/modules/register';
import users from 'interfaces/http/modules/users';
import forgotPassword from 'interfaces/http/modules/forgot_password';
import resetPassword from 'interfaces/http/modules/reset_password';
// SCHEMA DEFINITIONS AND RESOLVERS

export default () => {
  const { resolvers: authenticateResolvers, typeDefs: authenticateTypeDefs } = authenticate().authenticate;

  const { resolvers: resetPasswordResolvers, typeDefs: resetPasswordTypeDefs } = resetPassword().resetPassword;

  const { resolvers: resetPasswordResolvers, typeDefs: resetPasswordTypeDefs } = resetPassword().resetPassword;

  const { resolvers: registerResolvers, typeDefs: registerTypeDefs } = register().register;

  const { resolvers: usersResolvers, typeDefs: usersTypeDefs } = users().users;

  console.log(':::::::::::::::::::::::::', {
    usersResolvers,
  });

  return {
    resolvers: {
      ...authenticateResolvers.Type,
      ...registerResolvers.Type,
      Mutation: {
        ...forgotPasswordResolvers.Mutation,
        ...authenticateResolvers.Mutation,
        ...registerResolvers.Mutation,
        ...usersResolvers.Mutation,
      },
      Query: {
        ...usersResolvers.Query,
      },
    },
    typeDefs: [authenticateTypeDefs, registerTypeDefs, usersTypeDefs, forgotPasswordTypeDefs],
  };
};
