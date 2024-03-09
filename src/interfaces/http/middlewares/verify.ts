/*eslint-disable*/
import Status from 'http-status';
import { Request } from 'express';
import { GraphQLError, parse, OperationDefinitionNode, FieldNode } from 'graphql';
const WHITE_LIST = [
  'resetPassword',
  'forgotPassword',
  'signin',
  'signup',
  'IntrospectionQuery',
  '__schema',
];

const time = process.env.NODE_ENV === 'development' ? process.env.JWT_TOKEN_EXPIRE_TIME : '2s';

const TOKEN_EXPIRED_ERROR = 'TokenExpiredError';
// const FAIL_AUTH = 'Failed to authenticate token is expired.';

export default ({ jwt }: { jwt: any }) => {
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
      // console.log('operationName: ', selection?.name?.value);

      if (WHITE_LIST.includes(selection?.name?.value)) return null;

      const extractToken = authorization?.startsWith('Bearer ');

      console.log('extractToken extractToken', extractToken);

      if (extractToken) {
        const token = authorization?.split(' ')?.[1];
        try {
          jwt.verify({ maxAge: time })(token);
        } catch (e: any) {
          console.log('----------------------------', e);

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
