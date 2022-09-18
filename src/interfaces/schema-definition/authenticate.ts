import { readFileSync } from 'fs';
import { join } from 'path';
import { gql } from 'apollo-server-express';

export default ({ postUseCase }: any) => {
  const typeDefs = gql(readFileSync(join(__dirname, '../..', 'schema.graphql'), 'utf-8'));

  console.log('typeDefs typeDefs', typeDefs);
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
