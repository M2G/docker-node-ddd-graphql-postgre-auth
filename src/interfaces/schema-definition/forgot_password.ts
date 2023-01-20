import { readFileSync } from 'fs';
import { join } from 'path';
import gql from 'graphql-tag';
import type IUser from 'core/IUser';

export default ({ postUseCase, logger }: any) => {
  const typeDefs = gql(readFileSync(join(__dirname, '../..', 'users.graphql'), 'utf-8'));

  const resolvers = {
    Mutation: {
      forgotPassword: async (parent: any, args: any) => {
        const { email } = args;
        try {
          const user: IUser = await postUseCase.forgotPassword({ email });
          console.log('postUseCase resetPassword', user);
          logger.info({ ...user });

          return true;
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
