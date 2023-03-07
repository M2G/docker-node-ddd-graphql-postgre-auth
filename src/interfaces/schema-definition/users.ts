/*eslint-disable*/
import { readFileSync } from 'fs';
import { join } from 'path';
import gql from 'graphql-tag';
// import { comparePassword } from "infra/encryption";
// import type IUser from "core/IUser";
import type IUser from '../../core/IUser';
import { encryptPassword } from 'infra/encryption';

const libraries = [
  {
    branch: 'downtown',
  },
  {
    branch: 'riverside',
  },
];
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
export default ({ getUseCase, getOneUseCase, deleteUseCase, logger, putUseCase, postUseCase }: any) => {
  const typeDefs = gql(readFileSync(join(__dirname, '../..', 'users.graphql'), 'utf-8'));
  const resolvers = {
    Mutation: {
      createUser: async (parent: any, args: any) => {
        const { input } = args;
        const { ...params } = input as IUser;

        const hasPassword = encryptPassword(params.password);
        try {
          const { _doc: data }: { _doc: IUser } = await postUseCase.register({
            created_at: Math.floor(Date.now() / 1000),
            deleted_at: 0,
            email: params.email,
            last_connected_at: null,
            password: hasPassword,
          });

          console.log('data data data data', data);

          logger.info({ data });

          const user = {
            created_at: Math.floor(Date.now() / 1000),
            email: data?.email,
            first_name: data?.first_name,
            last_name: data?.last_name,
            modified_at: Math.floor(Date.now() / 1000),
          };

          return user;
        } catch (error: unknown) {
          console.log('error error', error);

          logger.error(error);
          throw new Error(error as string | undefined);
        }
      },
      deleteUser: async (parent: any, args: any) => {
        const { id } = args;

        console.log('deleteUser', id);

        try {
          const data = await deleteUseCase.remove({ _id: id });

          console.log('data', data);

          logger.info({ ...data });
          return data;
        } catch (error: unknown) {
          logger.error(error);
          throw new Error(error as string | undefined);
        }
      },
      updateUser: async (
        parent: any,
        args: {
          readonly input: any;
          readonly id: string;
        },
      ) => {
        const { input, id } = args;
        const { ...params } = input;
        try {
          const updateValue: IUser = {
            ...params,
            modified_at: Math.floor(Date.now() / 1000),
          };
          const data = await putUseCase.update({ _id: id, ...updateValue });
          logger.info({ ...data });

          if (!data) throw new Error("User doesn't exist");

          return data;
        } catch (error: unknown) {
          logger.error(error);
          throw new Error(error as string | undefined);
        }
      },
    },
    Query: {
      libraries(parent: any, args: any) {
        console.log('args args args', args);
        // Return our hardcoded array of libraries
        return libraries;
      },
      getUser: async (parent: any, args: any) => {
        console.log('args args args', args);

        const { id } = args;

        try {
          const data = await getOneUseCase.getOne({ _id: id });

          console.log('------->', data);

          logger.info({ ...data });
          return data;
        } catch (error: unknown) {
          logger.error(error);
          throw new Error(error as string | undefined);
        }
      },
      users: async (parent: any, { ...args }: any) => {
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
