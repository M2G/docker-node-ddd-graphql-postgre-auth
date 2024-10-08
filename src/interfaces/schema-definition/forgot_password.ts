import { readFileSync } from 'fs';
import { join } from 'path';
import gql from 'graphql-tag';
import type IUser from 'core/IUser';
// import { template, smtpTransport } from '../../nodemailer';

export default function ({ postUseCase, logger }) {
  const typeDefs = gql(readFileSync(join(__dirname, '../..', 'users.graphql'), 'utf-8'));

  const resolvers = {
    Mutation: {
      async forgotPassword(parent, args) {
        const { email } = args;
        try {
          const user: IUser = await postUseCase.forgotPassword({ email });
          logger.info({ ...user });

          console.log('user.reset_password_token', user.reset_password_token);

          /* const htmlToSend = template({
            name: 'test',
            url: `http://localhost:3002/reset-password?token=${user.reset_password_token}`,
          });

          console.log('process.env.NODE_ENV', process.env.NODE_ENV);

          const mailOptions = {
            from: 'sendersemail@example.com',
            html: htmlToSend,
            subject: 'Password help has arrived!',
            to:
              process.env.NODE_ENV === 'test'
                ? user.email
                : process.env.REAL_EMAIL,
            // to: process.env.REAL_EMAIL,
          };

          const info = await smtpTransport.sendMail(mailOptions);
          logger.info('Message sent successfully as %s', info.messageId);

          */

          return {
            success: true,
          };
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
}
