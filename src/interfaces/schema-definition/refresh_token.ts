import { readFileSync } from 'fs';
import { join } from 'path';
import gql from 'graphql-tag';
import type { IRefreshToken } from 'core/index';
import Status from 'http-status';
import { verifyExpiration } from './helpers';
import type IUser from 'core/IUser';
import config from '../../../config';
import { GraphQLError } from 'graphql/index';

export default function ({ getOneUseCase2, removeUseCase, getOneUseCase, jwt, logger }) {
  const typeDefs = gql(readFileSync(join(__dirname, '../..', 'auth.graphql'), 'utf-8'));

  const resolvers = {
    Mutation: {
      async refreshToken(_: any, args: { input: IRefreshToken }) {
        const { requestToken } = args;

        console.log('args', args);

        if (!requestToken) {
          // Refresh Token is required!
          //  return res.status(403).json({ message: "Refresh Token is required!" });
          throw new GraphQLError('Refresh Token is required!', {
            extensions: {
              code: Status.UNAUTHORIZED,
              http: {
                status: 403,
              },
            },
          });
        }

        try {
          const refreshToken = await getOneUseCase.getOne({ token: requestToken });

          if (!refreshToken) {
            // Refresh token is not in database
            // res.status(403).json({ message: "Refresh token is not in database!" });
            throw new GraphQLError('Refresh token is not in database!', {
              extensions: {
                code: Status.FORBIDDEN,
                http: {
                  status: 403,
                },
              },
            });
          }

          if (verifyExpiration(refreshToken)) {
            removeUseCase.remove({ id: refreshToken.id });
            /*
            res.status(403).json({
              message: 'Refresh token was expired. Please make a new signin request',
            });
            return;
             */
            throw new GraphQLError('Refresh token was expired. Please make a new signin request', {
              extensions: {
                code: Status.FORBIDDEN,
                http: {
                  status: 403,
                },
              },
            });
          }

          const user: IUser = await getOneUseCase2.getOne({ id: refreshToken.id });

          const payload = {
            id: user?.id,
          };

          const options = {
            audience: [],
            expiresIn: config.jwtExpiration,
            subject: user?.id?.toString(),
          };

          const newAccessToken = jwt.signin(options)(payload);

          return {
            accessToken: newAccessToken,
            refreshToken: refreshToken.token,
          };
        } catch (error) {
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
