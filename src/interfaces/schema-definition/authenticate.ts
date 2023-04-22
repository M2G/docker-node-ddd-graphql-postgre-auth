/* eslint-disable */
import { readFileSync } from 'fs';
import { join } from 'path';
import gql from 'graphql-tag';
import { comparePassword } from 'infra/encryption';
import type IUser from 'core/IUser';

export default ({ postUseCase, jwt, logger }: any) => {
  const typeDefs = gql(
    readFileSync(join(__dirname, '../..', 'auth.graphql'), 'utf-8'),
  );

  const resolvers = {
    Mutation: {
      signin: async (parent: any, args: any) => {
        const { input } = args;
        const { email, password } = input as IUser;

        console.log('input input input input', { email, password });

        try {
          const data: IUser = await postUseCase.authenticate({ email });

          console.log('data data data data', data);

          if (!data || !data.email) {
            throw new Error(
              `User not found (email: ${data.email}).`,
            );
          }

          const match = comparePassword(password, data.password);

          if (!match) {
            throw new Error(
              'Wrong username and password combination.',
            );
          }
          //@ts-ignore
          const payload: IUser = {
            id: data.id,
            email: data.email,
            password: data.password,
          };

          const options = {
            audience: [],
            expiresIn: 1 * 60,
            subject: data.email,
          };

          // if user is found and password is right, create a token
          const token: string = jwt.signin(options)(payload);

          console.log('token token token', token)

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
