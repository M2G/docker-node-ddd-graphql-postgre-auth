import { readFileSync } from 'fs';
import { join } from 'path';
import gql from 'graphql-tag';
// import type IUser from '../../core/IUser';
// import { comparePassword } from "infra/encryption";
// import type IUser from "core/IUser";
import { smtpTransport, template } from '../../nodemailer';

export default ({ postUseCase, getUseCase, getOneUseCase, deleteUseCase, jwt, logger }: any) => {
  const typeDefs = gql(readFileSync(join(__dirname, '../..', 'users.graphql'), 'utf-8'));

  const resolvers = {
    Mutation: {
      resetPassword: async (parent: any, args: any) => {
        console.log('resetPassword', {
          parent,
          args,
        });

        try {
          const user = postUseCase.resetPassword(args);

          const htmlToSend = template({
            name: 'test',
          });

          const data = {
            from: 'sendersemail@example.com',
            html: htmlToSend,
            subject: 'Password Reset Confirmation',
            to: user.email,
          };

          const info = smtpTransport.sendMail(data);
          console.log('Successfully sent email.');
          console.log('Message sent successfully as %s', info.messageId);
          console.log('postUseCase resetPassword', user);

          logger.info({ ...user });
          return user;
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
