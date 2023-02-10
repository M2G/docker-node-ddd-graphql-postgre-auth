import { readFileSync } from 'fs';
import { join } from 'path';
import gql from 'graphql-tag';
import { encryptPassword } from 'infra/encryption';
import type IUser from 'core/IUser';

export default ({ postUseCase, jwt, logger }: any) => {
  const typeDefs = gql(readFileSync(join(__dirname, '../..', 'auth.graphql'), 'utf-8'));
  const resolvers = {
    Mutation: {
      signup: async (parent: any, args: any) => {
        const { input } = args;
        const { ...params } = input as IUser;
        console.log('------------------------>', { ...params });

        const hasPassword = encryptPassword(params.password);
        try {
          const { _doc: data }: { _doc: IUser } = await postUseCase.register({
            created_at: Math.floor(Date.now() / 1000),
            deleted_at: 0,
            email: params.email,
            last_connected_at: null,
            password: hasPassword,
          });

          console.log('data data data data', data);

          logger.info({ data });

          return data;
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
