import { readFileSync } from 'fs';
import { join } from 'path';
import gql from 'graphql-tag';
// import type IUser from '../../core/IUser';
// import { comparePassword } from "infra/encryption";
// import type IUser from "core/IUser";
import { template, smtpTransport } from '../../nodemailer';

export default ({ postUseCase, logger }: any) => {
  const typeDefs = gql(readFileSync(join(__dirname, '../..', 'users.graphql'), 'utf-8'));

  const resolvers = {
    Mutation: {
      resetPassword: async (parent: any, args: any) => {
        console.log('resolvers resetPassword', {
          args,
          parent,
        });

        try {
          const user = postUseCase.resetPassword(args);

          console.log('postUseCase.resetPassword', user);

          const htmlToSend = template({
            name: 'test',
          });

          const mailOptions = {
            from: 'sendersemail@example.com',
            html: htmlToSend,
            subject: 'Password Reset Confirmation',
            to: process.env.NODE_ENV === 'test' ? user.email : 'm.pierrelouis@hotmail.fr',
          };

          console.log('TEST TEST');

          const info = await smtpTransport.sendMail(mailOptions);
          console.log('Successfully sent email.');
          console.log('Message sent successfully as %s', info.messageId);
          console.log('postUseCase resetPassword', user);

          logger.info({ ...user });

          const data = {
            success: true,
          };

          return data;
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
