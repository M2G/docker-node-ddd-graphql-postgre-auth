import { readFileSync } from 'fs';
import { join } from 'path';
import gql from 'graphql-tag';

export default ({ postUseCase, logger }: any) => {
  const typeDefs = gql(readFileSync(join(__dirname, '../..', 'users.graphql'), 'utf-8'));

  const resolvers = {
    Mutation: {
      changePassword: async (
        parent: any,
        args: { id: number; input: { password: string; oldPassword: string } },
      ) => {
        const {
          id,
          input: { password, oldPassword },
        } = args;
        try {
          const result: number[] | null = await postUseCase.changePassword({
            id,
            oldPassword,
            password,
          });

          logger.info({ ...result });

          return {
            success: !!result,
          };
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
