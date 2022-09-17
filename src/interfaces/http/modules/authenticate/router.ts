/* eslint-disable*/
import bcrypt from 'bcrypt';
import Status from 'http-status';
import { Router, Request, Response } from 'express';
import IUser from 'core/IUser';

export default ({
  jwt,
  postUseCase,
  logger,
  response: { Success, Fail },
}: any) => {
  const router = Router();

  router.post('/', async (req: Request, res: Response) => {
    const { body } = req || {};

    console.log('----------->', body);

    const { password, email } = <IUser>body;

    if (!email || !password)
      return res
        .status(Status.UNPROCESSABLE_ENTITY)
        .json(Fail('Empty value.'));

    try {
      const data: any = await postUseCase.authenticate({
        email: body.email,
      });

      const { email, password } = <IUser>data || {};

      if (!email)
        return res
          .status(Status.NOT_FOUND)
          .json(Fail(`User not found (email: ${body.email}).`));

      const match: boolean = await bcrypt.compare(
        body.password,
        password as string,
      );

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
        return res.status(Status.OK).json(
          Success({
            success: true,
            token: token,
          }),
        );
      }

      return res
        .status(Status.UNAUTHORIZED)
        .json(Fail('Wrong username and password combination.'));
    } catch (error: any) {
      logger.error(error);
      return res
        .status(Status.INTERNAL_SERVER_ERROR)
        .json(Fail(error.message));
    }
  });

  return router;
};
