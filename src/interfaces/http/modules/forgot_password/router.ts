/* eslint-disable*/
import Status from 'http-status';
import { Router, Request, Response } from 'express';
import IUser from 'core/IUser';
import { template, smtpTransport } from '../../../../nodemailer';

export default ({
                  postUseCase,
                  logger,
                  response: { Success, Fail },
                }: any) => {
  const router = Router();

  router.post('/', async (req: Request, res: Response) => {
    const { body = {} } = req || {};
    const { email } = <IUser>body;

    if (!email) {
      return res.status(Status.UNPROCESSABLE_ENTITY).json(Fail('Invalid parameters in request.'));
    }

    try {
      const user = await postUseCase.forgotPassword({ email });

      if (!user) return res.status(Status.NOT_FOUND).json(Fail('Not found user'));

      console.log('---------->', user)

      const htmlToSend = template({
        url: 'http://localhost:3002/reset-password?token=' + user.reset_password_token,
        name: 'test'
      });

      const mailOptions = {
        to: user.email,
        from: "sendersemail@example.com",
        subject: 'Password help has arrived!',
        html: htmlToSend,
      }

      smtpTransport.sendMail(mailOptions, function(error: any, response: any) {

        console.log('::::::::::::::', { error, response })

        if (error) return res.status(Status.INTERNAL_SERVER_ERROR).json(Fail(error.message));
        console.log("Successfully sent email.")
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
