import { gql } from 'apollo-server-express';

const typeDefs = gql`
  input SignupInput {
      email: String!
      password: String!
  }

  input SigninInput {
      email: String!
      password: String!
  }

  type Mutation {
      signup(input: SignupInput): String!
      signin(input: SigninInput): String!
  }
`;

export default ({
                  postUseCase,
                }: any) => {
  console.log('postUseCase postUseCase', postUseCase);

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
          ...args,
        });
      },
    },
    Query: {},
    Type: {},
  };

  return {
    resolvers,
    typeDefs,
  };
};
