import { readFileSync } from 'fs';
import { join } from 'path';
import gql from 'graphql-tag';
import { GraphQLError } from 'graphql/index';
import Status from 'http-status';

export default function ({ postUseCase, logger }) {
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

          if (!result) {
            throw new GraphQLError('An error occurred while changing the password', {
              extensions: {
                code: Status.UNAUTHORIZED,
                http: { status: 401 },
              },
            });
          }

          return {
            success: !!result,
          };
        } catch (error: unknown) {
          logger.error(error);
          throw new Error(error as string);
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
}
