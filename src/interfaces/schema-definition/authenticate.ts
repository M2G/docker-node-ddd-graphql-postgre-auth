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

  console.log('postUseCase postUseCase', postUseCase)

  const resolvers = {
    Mutation: {
      signin: (
        parent: any,
        args: any,
        context: any,
      ) => {
        console.log('--------------------------->',
          parent,
          args,
          context);

        return postUseCase.authenticate({
          args, context,
        });
      },
    },
    Type: {

      /* Author: {
        id: (parent) => parent._id,
      }, */
    },
  };

  return {
    resolvers,
    typeDefs,
  };
};
