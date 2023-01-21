import { readFileSync } from 'fs';
import { join } from 'path';
import gql from 'graphql-tag';
import type IUser from 'core/IUser';
import { template, smtpTransport } from '../../nodemailer';

export default ({ postUseCase, logger }: any) => {
  const typeDefs = gql(readFileSync(join(__dirname, '../..', 'users.graphql'), 'utf-8'));

  const resolvers = {
    Mutation: {
      forgotPassword: async (parent: any, args: any) => {
        const { email } = args;
        try {
          const user: IUser = await postUseCase.forgotPassword({ email });
          console.log('postUseCase resetPassword', user);
          logger.info({ ...user });

          const htmlToSend = template({
            name: 'test',
            url: `http://localhost:3002/reset-password?token=${user.reset_password_token}`,
          });

          const mailOptions = {
            from: 'sendersemail@example.com',
            html: htmlToSend,
            subject: 'Password help has arrived!',
            // to: user.email,
            to: "m.pierrelouis@hotmail.fr",
          };

          const info = await smtpTransport.sendMail(mailOptions);
          console.log('Message sent successfully as %s', info.messageId);

          return true;
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
