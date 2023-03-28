import { readFileSync } from 'fs';
import { join } from 'path';
import gql from 'graphql-tag';
import { encryptPassword } from 'infra/encryption';
import type IUser from 'core/IUser';

export default ({ postUseCase, jwt, logger }: any) => {
  const typeDefs = gql(readFileSync(join(__dirname, '../..', 'auth.graphql'), 'utf-8'));
  const resolvers = {
    Mutation: {
      signup: async (_: any, args: any) => {
        const { input } = args;
        const { email, password } = input as IUser;

        const hasPassword = encryptPassword(password);
        try {
          const { _doc: data }: { _doc: IUser } = await postUseCase.register({
            created_at: Math.floor(Date.now() / 1000),
            deleted_at: 0,
            email,
            last_connected_at: null,
            password: hasPassword,
          });

          logger.info({ data });

          const user = {
            created_at: Math.floor(Date.now() / 1000),
            email: data?.email,
            first_name: data?.first_name,
            last_name: data?.last_name,
            modified_at: Math.floor(Date.now() / 1000),
          };

          return user;
        } catch (error: unknown) {
          console.log('error error', error);

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
