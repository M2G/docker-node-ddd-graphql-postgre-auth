import { readFileSync } from 'fs';
import { join } from 'path';
import { gql } from 'apollo-server-express';
import { comparePassword } from 'infra/encryption';
import type IUser from 'core/IUser';

export default ({ postUseCase, jwt, logger }: any) => {
  const typeDefs = gql(
    readFileSync(join(__dirname, '../..', 'auth.graphql'), 'utf-8'),
  );

  console.log('typeDefs typeDefs', typeDefs);
  console.log('postUseCase postUseCase', postUseCase.authenticate);

  const resolvers = {
    Mutation: {
      signin: async (parent: any, args: any) => {
        const { input } = args;
        const { ...params } = input as IUser;

        console.log('::::::::::::::', params);

        try {
          const data: IUser = await postUseCase.authenticate({
            email: params.email,
          });

          const { email, password } = data || {};

          const match = comparePassword(params.password, password);

          if (match) {
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
          }
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
