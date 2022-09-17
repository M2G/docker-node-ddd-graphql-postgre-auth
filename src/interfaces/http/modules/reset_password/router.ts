/* eslint-disable*/
import Status from 'http-status';
import { Router, Request, Response } from 'express';
import { encryptPassword } from 'infra/encryption';
import { smtpTransport, template } from '../../../../nodemailer';

export default ({
                  postUseCase,
                  logger,
                  response: { Success, Fail },
                }: any) => {
  const router = Router();

  router.post('/', async (req: Request, res: Response) => {
    const { body = {} } = req || {};
    const { new_password, verify_password, token } = <any>body;

    if (!token || !new_password || !verify_password || new_password !== verify_password) {
      return res.status(Status.UNPROCESSABLE_ENTITY).json(Fail('Invalid parameters in request.'));
    }

    try {

      const hashPassword = encryptPassword(verify_password);

      console.log('{ password: hashPassword, token }', { password: hashPassword, token })

     const user = await postUseCase.resetPassword({ password: hashPassword, token });

      if (!user) return res.status(Status.NOT_FOUND).json(Fail('Not found user'));

      console.log('user user user user user', user)

      const htmlToSend = template({
        name: 'test'
      });

      const data = {
        to: user.email,
        from: "sendersemail@example.com",
        subject: 'Password Reset Confirmation',
        html: htmlToSend,
      };

      smtpTransport.sendMail(data, function(error: any, response: any) {
        console.log('::::::::::::::', { error, response })
        if (error) return res.status(Status.INTERNAL_SERVER_ERROR).json(Fail(error.message));
        console.log("Successfully sent email.");
      });

      logger.info({ ...user });
      return res.status(Status.OK).json(Success({ success: true }));

    } catch (error: any) {
      logger.error(error);
      return res.status(Status.INTERNAL_SERVER_ERROR).json(Fail(error.message));
    }
  });

  return router;
};
