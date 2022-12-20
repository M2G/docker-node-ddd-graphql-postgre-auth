import { readFileSync } from 'fs';
import { join } from 'path';
import gql from 'graphql-tag'
import type IUser from '../../core/IUser';
// import { comparePassword } from "infra/encryption";
// import type IUser from "core/IUser";

export default ({
  postUseCase,
  getUseCase,
  getOneUseCase,
  deleteUseCase,
  jwt,
  logger,
}: any) => {
  const typeDefs = gql(
    readFileSync(join(__dirname, '../..', 'users.graphql'), 'utf-8'),
  );

  const resolvers = {
    Mutation: {
      resetPassword: async (parent: any, args: any) => {
        const { password, email } = <IUser>args;

        if (!email || !password) return 'Empty value.';

        try {
          const data: any = await postUseCase.authenticate({
            email: body.email,
          });

          const { email, password } = <IUser>data || {};

          if (!email) {
return res
              .status(Status.NOT_FOUND)
              .json(Fail(`User not found (email: ${body.email}).`));
}

          const match: boolean = await bcrypt.compare(
            body.password,
            password,
          );

          if (match) {
            const payload = <IUser>{ email, password };

            const options = {
              subject: email,
              audience: [],
              expiresIn: 60 * 60,
            };

            // if user is found and password is right, create a token
            const token: string = jwt.signin(options)(payload);

            logger.info({ token });
            return res.status(Status.OK).json(
              Success({
                success: true,
                token,
              }),
            );
          }

          return res
            .status(Status.UNAUTHORIZED)
            .json(Fail('Wrong username and password combination.'));
        } catch (error: any) {
          logger.error(error);
          return error;
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
