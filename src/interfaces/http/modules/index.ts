/*eslint-disable*/
import { Router } from 'express';
import Status from 'http-status';

export default () => {
  const router = Router();

  router.get('/', (req: any, res: any) => {
    res.status(Status.OK).json({ status: 'API working' })
  });

  return router;
};
