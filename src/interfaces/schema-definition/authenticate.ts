import { gql } from 'apollo-server-express';

const typeDefs = gql`
  """Object Type that represents a Signup"""
  input SignupInput {
      email: String!
      password: String!
  }

  input SigninInput {
      email: String!
      password: String!
  }

  extend type Mutation {
      signup(input: SignupInput): String!
      signin(input: SigninInput): String!
  }
`;

export default ({
                  postUseCase,
                }: any) => {
  const resolvers = {
    Type: {

      /* Author: {
        id: (parent) => parent._id,
      }, */
    },
    Mutation: {
      signin: (
        parent: any,
        args: any,
        context: any,
      ) => {
        console.log('---------------------------_>',
          parent,
          args,
          context);

        return postUseCase.authenticate({
          args, context,
        });
      },
    },
  };

  return {
    resolvers,
    typeDefs,
  };
};
