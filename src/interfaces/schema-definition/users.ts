import { readFileSync } from 'fs';
import { join } from 'path';
import { gql } from 'apollo-server-express';
// import { comparePassword } from "infra/encryption";
// import type IUser from "core/IUser";
import { GraphQLError } from 'graphql';

export default (
  {
 getUseCase, getOneUseCase, deleteUseCase, logger, putUseCase,
}: any,
) => {
  const typeDefs = gql(readFileSync(join(__dirname, '../..', 'users.graphql'), 'utf-8'));

  const resolvers = {
    Mutation: {
      deleteUser: async (parent: any, args: any) => {
        const { id } = args;

        console.log('deleteUser', id);

        try {
          const data = await deleteUseCase.remove({ _id: id });
          logger.info({ ...data });
          return data;
        } catch (error: unknown) {
          logger.error(error);
          throw new Error(error as string | undefined);
        }
      },
      updateUser: async (parent: any, args: any) => {
        const { input, id } = args;
        const { ...params } = input;

        console.log('users', args);

        try {
          const data = await putUseCase.update({ _id: id, ...params });
          logger.info({ ...data });

          if (!data) throw new GraphQLError('User doesn\'t exist', { extensions: { code: 'BAD_USER_INPUT' }} as any);

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
      users: async (
        parent: any,
        args: any,
      ) => {
        const { search = {}} = args;
        console.log('search search search search search', search);

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
