/* eslint-disable*/
import Status from 'http-status';
import { Router, Request, Response } from 'express';
import IUser from 'core/IUser';
import { encryptPassword } from 'infra/encryption';

export default ({
  postUseCase,
  jwt,
  logger,
  response: { Success, Fail },
}: any) => {
  const router = Router();

  router.post('/', async (req: Request, res: Response) => {
    const { body = {} } = req || {};
    const { email, password } = <IUser>body;

    if (!email || !password)
      return res
        .status(Status.UNPROCESSABLE_ENTITY)
        .json(Fail('Invalid parameters in request.'));

    const hasPassword = encryptPassword(password);

    try {
      const { _doc: data }: any = await postUseCase.register({
        email,
        password: hasPassword,
        created_at: Math.floor(Date.now() / 1000),
        deleted_at: 0,
        last_connected_at: null,
      });

      return res.status(Status.OK).json(Success({ ...data }));
    } catch (error: any) {
      logger.error(error);
      return res
        .status(Status.INTERNAL_SERVER_ERROR)
        .json(Fail(error.message));
    }
  });

  return router;
};
