/*eslint-disable*/
import { readFileSync } from 'fs';
import { join } from 'path';
import gql from 'graphql-tag';
// import { comparePassword } from "infra/encryption";
// import type IUser from "core/IUser";
import type IUser from '../../core/IUser';
import { encryptPassword } from 'infra/encryption';
import console from 'console';

/*
const data = [
  {
    _id: '1325166e24edff96de6bf90b',
    first_name: 'Mick',
    last_name: 'Tayson',
    email: 'mick.tayson@university.com',
    created_at: 1658098356,
    modified_at: 1658098356,
  },
  {
    _id: '1325166e24edff96de6bf90b',
    first_name: 'Mick',
    last_name: 'Tayson',
    email: 'mick.tayson@university.com',
    created_at: 1658098356,
    modified_at: 1658098356,
  },
];
*/
export default ({
  getUseCase,
  getOneUseCase,
  deleteUseCase,
  logger,
  putUseCase,
  postUseCase,
}: any) => {
  const typeDefs = gql(
    readFileSync(join(__dirname, '../..', 'users.graphql'), 'utf-8'),
  );
  const resolvers = {
    Mutation: {
      createUser: async (_: any, args: any) => {
        const { input } = args;
        const { ...params } = input as IUser;

        const hasPassword = encryptPassword(params.password);
        try {
          const data = await postUseCase.register({
            created_at: Date.now(),
            deleted_at: 0,
            email: params.email,
            last_connected_at: null,
            password: hasPassword,
          });

          console.log('data data data data', data);

          logger.info({ data });

          return data;
        } catch (error: unknown) {
          logger.error(error);
          throw new Error(error as string | undefined);
        }
      },
      deleteUser: async (_: any, args: any) => {
        const { id } = args;
        try {
          const data = await deleteUseCase.remove({ id });
          logger.info({ ...data });
          return data;
        } catch (error: unknown) {
          logger.error(error);
          throw new Error(error as string | undefined);
        }
      },
      updateUser: async (
        _: any,
        args: {
          readonly input: any;
          readonly id: string;
        },
      ) => {

        console.log('args', args)

        const { input, id } = args;
        const { email, first_name, last_name, username } = input || {};

        try {
          const updateValue = {
            email,
            first_name,
            last_name,
            username,
            modified_at: Date.now(),
          };

          console.log('updateValue', { id, ...updateValue })

          const [data] = await putUseCase.update({ id, ...updateValue });

          console.log('updateValue 2', data)

          logger.info({ ...data });

          if (!data) throw new Error("User doesn't exist");

          return {
            success: !!data,
          };
        } catch (error: unknown) {
          logger.error(error);
          throw new Error(error as string | undefined);
        }
      },
    },
    Query: {
      getUser: async (_: any, args: any) => {
        const { id } = args;
        try {
          const data = await getOneUseCase.getOne({ id });
          logger.info({ ...data });
          return data;
        } catch (error: unknown) {
          logger.error(error);
          throw new Error(error as string | undefined);
        }
      },
      users: async (_: any, { ...args }: any) => {
        try {
          const data = await getUseCase.all({ ...args });
          logger.info({ ...data });
          return data;
        } catch (error: unknown) {
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
};
