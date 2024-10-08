import { readFileSync } from 'fs';
import { join } from 'path';
import gql from 'graphql-tag';
import { v4 as uuidv4 } from 'uuid';
import config from '../../../config';
import { comparePassword } from 'infra/encryption';
import type IUser from 'core/IUser';
import Status from 'http-status';
import { GraphQLError } from 'graphql';

export default function ({ postUseCase2, postUseCase, jwt, logger, locale, i18nProvider }) {
  const typeDefs = gql(readFileSync(join(__dirname, '../..', 'auth.graphql'), 'utf-8'));
  // userNotFound %s
  const resolvers = {
    Mutation: {
      async signin(_: any, args: { input: IUser }) {
        const { input } = args;
        const { email, password } = input || {};
        try {
          const data: IUser = await postUseCase.authenticate({ email });
          if (!data?.email) {
            logger.info(locale.translate(`userNotFound %s`, email));
            throw new GraphQLError(locale.translate(`userNotFound %s`, email) as string, {
              extensions: {
                code: Status.UNAUTHORIZED,
                http: { status: 401 },
              },
            });
          }

          const match = comparePassword(password, data.password);

          if (!match) {
            throw new GraphQLError(locale.translate(`wrongUsernamePasswordCombination`) as string, {
              extensions: {
                code: Status.UNAUTHORIZED,
                http: {
                  status: 401,
                },
              },
            });
          }

          const payload = {
            email: data.email,
            id: data.id,
            password: data.password,
          };

          const options = {
            audience: [],
            expiresIn: 1 * 30,
            subject: data.email,
          };

          const expiredAt = new Date();

          expiredAt.setSeconds(expiredAt.getSeconds() + config.jwtRefreshExpiration);

          const refreshToken = await postUseCase2.register({
            expiryDate: expiredAt.getTime(),
            id: data.id,
            token: uuidv4(),
          });

          // if user is found and password is right, create a token
          const token: string = jwt.signin(options)(payload);

          logger.info({ token });

          return {
            accessToken: token,
            refreshToken: refreshToken.token,
          };
        } catch (error) {
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
