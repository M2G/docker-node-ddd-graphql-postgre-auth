import { readFileSync } from 'fs';
import { join } from 'path';
import gql from 'graphql-tag';
import { comparePassword } from 'infra/encryption';
import type IUser from 'core/IUser';
import HttpException from 'infra/support';

export default ({ postUseCase, jwt, logger }: any) => {
  const typeDefs = gql(readFileSync(join(__dirname, '../..', 'auth.graphql'), 'utf-8'));

  const resolvers = {
    Mutation: {
      signin: async (parent: any, args: any) => {
        const { input } = args;
        const { email, password } = (input as IUser) || {};

        console.log('input input input input', { email, password });

        try {
          const data: IUser = await postUseCase.authenticate({ email });

          console.log('authenticate authenticate authenticate', data);

          if (!data?.email) {
            logger.info(`User not found (email: ${email}).`);
            throw new HttpException(401, 'USER_NOT_FOUND');
            /*
            throw new GraphQLError(`User not found (email: ${data.email}).`, {
              extensions: {
                code: Status.UNAUTHORIZED,
                http: { status: 401 },
              },
            });
             */
          }

          const match = comparePassword(password, data.password);

          if (!match) {
            throw new HttpException(401, 'WRONG_COMBINATION');
            /*
               throw new GraphQLError('Wrong username and password combination. 222', {
              extensions: {
                code: 'SOMETHING_WRONG_CONBINATION',
                http: {
                  status: 401,
                },
              },
            });
             */
          }

          const payload: IUser = {
            email: data.email,
            id: data.id,
            password: data.password,
          };

          const options = {
            audience: [],
            expiresIn: 5 * 60,
            subject: data.email,
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
