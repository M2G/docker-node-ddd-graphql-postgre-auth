import { readFileSync } from 'fs';
import { join } from 'path';
import { gql } from 'apollo-server-express';
import { comparePassword } from "infra/encryption";

export default ({ postUseCase }: any) => {
  const typeDefs = gql(readFileSync(join(__dirname, '../..', 'schema.graphql'), 'utf-8'));

  console.log('typeDefs typeDefs', typeDefs);
  console.log('postUseCase postUseCase', postUseCase.authenticate);

  const resolvers = {
    Mutation: {
      signin: (
        parent: any,
        args: any,
        context: any,
      ) => {
        console.log('--------------------------->',
          {
            parent,
            args,
            context
          });

        const { input } = args;
        const { ...params } = input;

        console.log('::::::::::::::', params)

        /*const user = postUseCase.authenticate({
          ...args,
        });

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
   }




        */


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
