import { readFileSync } from 'fs';
import { join } from 'path';
import gql from 'graphql-tag';
import { comparePassword } from 'infra/encryption';
import type IUser from 'core/IUser';
import toEntity from 'infra/repositories/users/transform';

export default ({
 getOneUseCase, postUseCase, putUseCase, jwt, logger,
}: any) => {
  const typeDefs = gql(
    readFileSync(join(__dirname, '../..', 'users.graphql'), 'utf-8'),
  );

  const resolvers = {
    Mutation: {
      forgotPassword: (parent: any, args: any) => {
        try {
          const user = postUseCase.forgotPassword(args);
          logger.info({ ...user });
          return user;
        } catch (error: unknown) {
          logger.error(error);
          throw new Error(error as string | undefined);
        }
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
