/*eslint-disable*/
import { GraphQLError } from 'graphql';
import Status from 'http-status';
import { Request } from 'express';

const time =
  process.env.NODE_ENV === 'development'
    ? process.env.JWT_TOKEN_EXPIRE_TIME
    : '2s';

const TOKEN_EXPIRED_ERROR = 'TokenExpiredError';
// const FAIL_AUTH = 'Failed to authenticate token is expired.';

export default ({ jwt }: { jwt: any }) => {
  return {
    authorization: ({ req }: { req: Request }) => {
      const {
        headers: { authorization },
        body: { query, operationName },
      } = req;

      console.log('authorization query query query query query', operationName)

      if (!query?.includes('GetUsers')) return null;

      const extractToken = authorization?.startsWith('Bearer ');

      console.log('extractToken extractToken', extractToken);

      if (extractToken) {
        const token = authorization?.split(' ')?.[1];
        try {
          jwt.verify({ maxAge: time })(token);
        } catch (e: any) {
          if (e.name === TOKEN_EXPIRED_ERROR)
            throw new GraphQLError(<string>Status[Status.UNAUTHORIZED], {
              extensions: {
                code: Status.UNAUTHORIZED,
                http: { status: 401 },
              },
            });

          throw new GraphQLError(<string>Status[Status.BAD_REQUEST], {
            extensions: {
              code: Status.BAD_REQUEST,
              http: { status: 400 },
            },
          });
        }

        return null;
      }

      throw new Error('No token provided.');
    },
  };
};
