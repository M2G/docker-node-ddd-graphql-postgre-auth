/*eslint-disable*/
import { readFileSync } from 'fs';
import { join } from 'path';
import gql from 'graphql-tag';
import type IUser from '../../core/IUser';
import { encryptPassword } from 'infra/encryption';

// @ts-ignore
export default function ({
  getUseCase,
  getOneUseCase,
  deleteUseCase,
  logger,
  putUseCase,
  postUseCase,
}) {
  const typeDefs = gql(readFileSync(join(__dirname, '../..', 'users.graphql'), 'utf-8'));
  const resolvers = {
    Mutation: {
      async createUser(_: any, args: { input: IUser }) {
        const { input } = args;
        const { ...params } = input;

        const hasPassword = encryptPassword(params.password);
        try {
          const data = await postUseCase.register({
            created_at: Date.now(),
            deleted_at: 0,
            email: params.email,
            last_connected_at: null,
            password: hasPassword,
          });

          logger.info({ data });

          return data;
        } catch (error) {
          logger.error(error);
          throw new Error(error as string | undefined);
        }
      },
      deleteUser: async (_: any, args: { id: number }) => {
        const { id } = args;
        try {
          const data = await deleteUseCase.remove({ id });
          logger.info({ ...data });
          return {
            success: !!data,
          };
        } catch (error) {
          logger.error(error);
          throw new Error(error as string | undefined);
        }
      },
      async updateUser(
        _: any,
        args: {
          readonly input: any;
          readonly id: string;
        },
      ) {
        const { input, id } = args;
        const { email, first_name, last_name, username, password } = input || {};

        const hasPassword = encryptPassword(password);

        try {
          const updateValue = {
            email,
            first_name,
            last_name,
            username,
            modified_at: Date.now(),
            password: hasPassword,
          };

          const [data] = await putUseCase.update({ id, ...updateValue });

          logger.info({ ...data });

          if (!data) throw new Error("User doesn't exist");

          return {
            success: !!data,
          };
        } catch (error) {
          logger.error(error);
          throw new Error(error as string | undefined);
        }
      },
    },
    Query: {
      async getUser(_: any, args: { id: any }) {
        const { id } = args;
        try {
          const data = await getOneUseCase.getOne({ id });
          logger.info({ ...data });
          return data;
        } catch (error) {
          logger.error(error);
          throw new Error(error as string | undefined);
        }
      },
      async users(_: any, { ...args }) {
        try {
          const data = await getUseCase.all({ ...args });
          logger.info({ ...data });
          return data;
        } catch (error) {
          logger.error(error);
          throw new Error(error as string | undefined);
        }
      },
    },
    Type: {},
  };

  return {
    resolvers,
    typeDefs,
  };
}
