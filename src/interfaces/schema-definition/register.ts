import { readFileSync } from 'fs';
import { join } from 'path';
import gql from 'graphql-tag';
import type IUser from 'core/IUser';

export default ({ postUseCase, logger }: any) => {
  const typeDefs = gql(
    readFileSync(join(__dirname, '../..', 'auth.graphql'), 'utf-8'),
  );
  const resolvers = {
    Mutation: {
      signup: async (_: any, args: any) => {
        const { input } = args;
        const { email, password } = input as IUser;
        try {
          const { _doc: data }: { _doc: IUser } = await postUseCase.register({
            created_at: Date.now(),
            deleted_at: 0,
            email,
            last_connected_at: null,
            password,
          });

          logger.info({ data });

          return {
            created_at: Date.now(),
            email: data?.email,
            first_name: data?.first_name,
            last_name: data?.last_name,
            modified_at: Date.now(),
          };
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
