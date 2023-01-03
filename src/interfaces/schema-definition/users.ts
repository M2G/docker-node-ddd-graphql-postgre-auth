import { readFileSync } from 'fs';
import { join } from 'path';
import gql from 'graphql-tag';
// import { comparePassword } from "infra/encryption";
// import type IUser from "core/IUser";
import type IUser from '../../core/IUser';

export default ({ getUseCase, getOneUseCase, deleteUseCase, logger, putUseCase }: any) => {
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
      users: (parent: any, { filters, page, pageSize }: any) => {
        console.log('users users users users', { filters, page, pageSize });

        /*
        try {
          const data = await getUseCase.all({ filters, page, pageSize });
          logger.info({ ...data });
          return data;
        } catch (error: unknown) {
          logger.error(error);
          throw new Error(error as string | undefined);
        } */

        return {
          data: {
            users: [
              {
                results: [
                  {
                    _id: '1325166e24edff96de6bf90b',
                    first_name: 'Mick',
                    last_name: 'Tayson',
                    email: 'mick.tayson@university.com',
                    created_at: 1658098356,
                    modified_at: 1658098356,
                  },
                ],
                pageInfo: {
                  count: 7,
                  pages: 7,
                  next: 4,
                  prev: 2,
                },
              },
            ],
          },
        };
      },
      hello: (_: any, { filters, page, pageSize }: any) => {
        console.log('users users users users', { filters, page, pageSize });



        return 'test';
      },
    },
    Type: {},
  };

  return {
    resolvers,
    typeDefs,
  };
};
