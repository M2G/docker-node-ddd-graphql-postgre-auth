import { readFileSync } from 'fs';
import { join } from 'path';
import { gql } from 'apollo-server-express';
import { comparePassword, encryptPassword } from 'infra/encryption';
import type IUser from 'core/IUser';

export default ({ postUseCase, jwt, logger }: any) => {
  const typeDefs = gql(readFileSync(join(__dirname, '../..', 'auth.graphql'), 'utf-8'));
  const resolvers = {
    Mutation: {
      signup: async (parent: any, args: any) => {
        const { input } = args;
        const { ...params } = input as IUser;
        console.log('------------------------>', postUseCase);

        const hasPassword = encryptPassword(params.password);
        try {
          const { _doc: data }:
            { _doc: { email: string; password: string } } = await postUseCase.register({
            created_at: Math.floor(Date.now() / 1000),
            deleted_at: 0,
            email: params.email,
            last_connected_at: null,
            password: hasPassword,
          });

          const { email, password } = data || {};

          const match = comparePassword(params.password, password);

          if (!match) return null;
          const payload = { email, password };

          const options = {
            audience: [],
            expiresIn: 60 * 60,
            subject: email,
          };

          // if user is found and password is right, create a token
          const token: string = jwt.signin(options)(payload);

          logger.info({ token });

          return token;
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
