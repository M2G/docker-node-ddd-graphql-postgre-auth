import { readFileSync } from 'fs';
import { join } from 'path';
import gql from 'graphql-tag';
// import type IUser from '../../core/IUser';
// import { comparePassword } from "infra/encryption";
// import type IUser from "core/IUser";

export default ({ postUseCase, getUseCase, getOneUseCase, deleteUseCase, jwt, logger }: any) => {
  const typeDefs = gql(readFileSync(join(__dirname, '../..', 'users.graphql'), 'utf-8'));

  const resolvers = {
    Mutation: {
      resetPassword: async (parent: any, args: any) => {
        console.log('---------', {
          parent,
          args,
        });

        try {
          const user = postUseCase.resetPassword(args);
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
