import Status from 'http-status';
import type { Request } from 'express';
import type { OperationDefinitionNode, FieldNode } from 'graphql';
import { GraphQLError, parse } from 'graphql';

const WHITE_LIST = [
  'refreshToken',
  'resetPassword',
  'forgotPassword',
  'signin',
  'signup',
  'IntrospectionQuery',
  '__schema',
];

const time = process.env.NODE_ENV === 'development' ? process.env.JWT_TOKEN_EXPIRE_TIME : '30s';

const TOKEN_EXPIRED_ERROR = 'TokenExpiredError';
// const FAIL_AUTH = 'Failed to authenticate token is expired.';

export default function ({ jwt }: { jwt: any }) {
  return {
    authorization: ({ req }: { req: Request }): null => {
      const {
        headers: { authorization },
        body: { query },
      } = req;

      // @see https://stackoverflow.com/questions/64168556/apollo-nodejs-server-how-to-get-mutation-query-schema-path-in-the-request-conte
      const obj = parse(query);
      const operationDefinition = obj.definitions[0] as OperationDefinitionNode;
      const selection = operationDefinition.selectionSet.selections[0] as FieldNode;

      if (WHITE_LIST.includes(selection.name.value)) return null;

      const extractToken = authorization?.startsWith('Bearer ');

      if (extractToken) {
        const token = authorization?.split(' ')?.[1];
        try {
          jwt.verify({
            maxAge: '60s',
            // time,
          })(token);
        } catch (e) {
          console.log('----------------------------', e);

          if (e.name === TOKEN_EXPIRED_ERROR) {
            throw new GraphQLError(Status[Status.UNAUTHORIZED], {
              extensions: {
                code: Status.UNAUTHORIZED,
                http: { status: Status.UNAUTHORIZED },
              },
            });
          }

          throw new GraphQLError(Status[Status.BAD_REQUEST], {
            extensions: {
              code: Status.BAD_REQUEST,
              http: { status: Status.BAD_REQUEST },
            },
          });
        }

        return null;
      }

      throw new Error('No token provided.');
    },
  };
}
