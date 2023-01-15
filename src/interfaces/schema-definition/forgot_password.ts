import { readFileSync } from 'fs';
import { join } from 'path';
import gql from 'graphql-tag';
import { comparePassword } from 'infra/encryption';
import type IUser from 'core/IUser';

export default ({ postUseCase, jwt, logger }: any) => {
  const typeDefs = gql(
    readFileSync(join(__dirname, '../..', 'users.graphql'), 'utf-8'),
  );

  console.log('typeDefs typeDefs', typeDefs);
  console.log('postUseCase postUseCase', postUseCase.authenticate);

  const resolvers = {
    Mutation: {
      forgotPassword: async (parent: any, args: any) => {

          console.log('--------->', {
            parent,
            args,
          });

          return "test";
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
