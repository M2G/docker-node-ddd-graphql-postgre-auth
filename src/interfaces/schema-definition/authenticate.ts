import { readFileSync } from 'fs';
import { join } from 'path';
import {
  SchemaDirectiveVisitor,
  AuthenticationError,
  ForbiddenError,
  gql,
} from 'apollo-server-express';
import { comparePassword } from "infra/encryption";
import type IUser from "core/IUser";
import { GraphQLError } from 'graphql';

export default ({ postUseCase, jwt, logger }: any) => {
  const typeDefs = gql(readFileSync(join(__dirname, '../..', 'auth.graphql'), 'utf-8'));

  const resolvers = {
    Mutation: {
      signin: async (
        parent: any,
        args: any,
      ) => {
        const { input } = args;
        const { email, password } = input as IUser;

        try {
        const data: IUser = await postUseCase.authenticate({ email });

        if (!email) throw new AuthenticationError(`User not found (email: ${email}).`);

        const match = comparePassword(password, data.password);

        if (!match) throw new AuthenticationError('Wrong username and password combination.');
          const payload = { email: data.email, password: data.password };

          const options = {
            audience: [],
            expiresIn: 60 * 60,
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
