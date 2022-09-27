import { readFileSync } from 'fs';
import { join } from 'path';
import { gql } from 'apollo-server-express';
// import { comparePassword } from "infra/encryption";
// import type IUser from "core/IUser";

export default (
  {
 getUseCase, getOneUseCase, deleteUseCase, jwt, logger,
}: any,
) => {
  const typeDefs = gql(readFileSync(join(__dirname, '../..', 'users.graphql'), 'utf-8'));

  const resolvers = {
    Mutation: {
      deleteUser: async (parent: any, args: any) => {
        const { input } = args;
        const { ...params } = input;
        const { _id } = params;

        console.log('getUser', params);

        try {
          const data = await deleteUseCase.remove({ _id });
          logger.info({ ...data });
          return data;
        } catch (error: unknown) {
          logger.error(error);
          throw new Error(error as string | undefined);
        }
      },
      updateUser: async (parent: any, args: any) => {
        const { input } = args;
        const { ...params } = input;
        const { _id } = params;
        console.log('users', params);

        try {
          const data = await deleteUseCase.remove({ _id });
          logger.info({ ...data });
          return data;
        } catch (error: unknown) {
          logger.error(error);
          throw new Error(error as string | undefined);
        }
      },
    },
    Query: {
      getUser: async (parent: any, args: any) => {

        console.log('args args args', args);

        const { input } = args;
        const { ...params } = input;
        const { _id } = params;

        console.log('getUser', params);

        try {
          const data = await getOneUseCase.getOne({ _id });
          logger.info({ ...data });
          return data;
        } catch (error: unknown) {
          logger.error(error);
          throw new Error(error as string | undefined);
        }
      },
      users: async (
        parent: any,
        args: any,
      ) => {
        console.log('users users users', { args, parent });

        const { search = {}} = args;

        console.log('search search search search search', {search, getUseCase});

        try {
          const data = await getUseCase.all(search ? { ...search } : {});
          console.log(':::::::::::::::::::', data);
          logger.info({ ...data });
          console.log('data data data data data', data);
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
