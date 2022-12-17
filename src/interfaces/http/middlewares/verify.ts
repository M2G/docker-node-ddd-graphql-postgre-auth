/*eslint-disable*/
import Status from 'http-status';
import { AuthenticationError } from 'apollo-server-express';

const time =
  process.env.NODE_ENV === 'development'
    ? '60s' //process.env.JWT_TOKEN_EXPIRE_TIME
    : '2s';

const TOKEN_EXPIRED_ERROR = 'TokenExpiredError';
const FAIL_AUTH = 'Failed to authenticate token is expired.';

export default ({ jwt }: any) => {
  return {
    authorization: ({ req }: any) => {
      const {
        headers: { authorization },
        body: { query }
      } = req || {};

      if (!query?.includes('users')) return null;

      console.log(
        'operationName operationName operationName',
        query?.includes('users')
      );

      const extractToken = authorization?.startsWith('Bearer ');

      console.log('extractToken extractToken', extractToken);

      if (extractToken) {
        const token = authorization?.split(' ')?.[1];
        try {
          jwt.verify({ maxAge: time })(token);
        } catch (e: any) {
          if (e.name === TOKEN_EXPIRED_ERROR)
            //throw new Error(FAIL_AUTH);
            throw new AuthenticationError(FAIL_AUTH);

          throw new Error('BAD_REQUEST');
        }

        return null;
      }

      throw new Error('No token provided.');
    }
  };
};
