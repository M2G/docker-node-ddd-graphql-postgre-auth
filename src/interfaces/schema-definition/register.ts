import { readFileSync } from 'fs';
import { join } from 'path';
import gql from 'graphql-tag';
import { encryptPassword } from 'infra/encryption';
import type IUser from 'core/IUser';
import HttpException from 'infra/support';
import { Errors } from '../../types';

const DUPLICATE_ERROR = 'Duplicate error';

export default function ({ postUseCase, logger }) {
  const typeDefs = gql(readFileSync(join(__dirname, '../..', 'auth.graphql'), 'utf-8'));
  const resolvers = {
    Mutation: {
      signup: async (_: any, args: any) => {
        const { input } = args;
        const { email, password } = input as IUser;

        const hashPassword = encryptPassword(password);
        try {
          const data = await postUseCase.register({
            created_at: Date.now(),
            deleted_at: 0,
            email,
            last_connected_at: null,
            password: hashPassword,
          });

          logger.info({ data });

          return {
            created_at: Date.now(),
            email: data?.email,
            first_name: data?.first_name,
            id: data?.id,
            last_name: data?.last_name,
            modified_at: Date.now(),
          };
        } catch (error: Error) {
          console.log('error', error.message);
          if (error.message === DUPLICATE_ERROR) {
            throw new HttpException(409, Errors.DUPLICATE_ERROR);
          }

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
}
