/*eslint-disable*/
import { readFileSync } from 'fs';
import { join } from 'path';
import gql from 'graphql-tag';
import { encryptPassword } from 'infra/encryption';
// import type IUser from '../../core/IUser';
// import { comparePassword } from "infra/encryption";
// import type IUser from "core/IUser";
import { template, smtpTransport } from '../../nodemailer';

export default ({ postUseCase, logger, jwt }: any) => {
  const typeDefs = gql(
    readFileSync(join(__dirname, '../..', 'users.graphql'), 'utf-8'),
  );

  const resolvers = {
    Mutation: {
      resetPassword: async (
        _: any,
        args: {
          readonly input: { readonly password: string; readonly token: string };
        },
      ) => {
        const { input } = args;
        const { password, token } = input;

        console.log('input', { password, token });
        try {
         jwt.verify({ maxAge: process.env.JWT_TOKEN_EXPIRE_TIME })(token);
         const hashPassword = encryptPassword(password);
         const user = await postUseCase.resetPassword({
           password: hashPassword,
           reset_password_token: token,
         });

        const htmlToSend = template({
           name: 'test',
         });

         const mailOptions = {
           from: 'sendersemail@example.com',
           html: htmlToSend,
           subject: 'Password reset confirmation',
           to:
             process.env.NODE_ENV === 'test'
               ? user.email
               : process.env.REAL_EMAIL,
         };

         const info = await smtpTransport.sendMail(mailOptions);

         logger.info('Successfully sent email.');
         logger.info('Message sent successfully as %s', info.messageId);
         logger.info({ ...user });

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
};
