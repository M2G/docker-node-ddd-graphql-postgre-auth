/* eslint-disable*/
import Status from 'http-status';
import { Router, Request, Response, NextFunction } from 'express';
import IUser from 'core/IUser';
import { isValidObjID } from 'interfaces/http/utils';

export default ({
  getOneUseCase,
  getUseCase,
  putUseCase,
  deleteUseCase,
  logger,
  response: { Success, Fail },
  auth,
}: any) => {
  const router = Router();

  router.use((req: Request, res: Response, next: NextFunction) =>
    auth.authenticate(req, res, next));

  router
    .get('/', async (req: Request, res: Response) => {

      const { query } = req || {};
      const { search } = query;

      try {
      const data = await getUseCase.all(search ? { search } : {});

        res.status(Status.OK).json(Success(data));
      } catch (error: any) {
        logger.error(error);
        res.status(Status.BAD_REQUEST).json(Fail(error.message));
      }
    });

  router
    .get('/:id', async (req: Request, res: Response) => {

      const { params } = req || {};
      const { id } = params;

      if (!isValidObjID(id))
        return res.status(Status.UNPROCESSABLE_ENTITY).json(Fail('Invalid id parameters in request.'));

      try {
        const data = await getOneUseCase.getOne({ _id: req.params.id });
        logger.debug(data);
        return res.status(Status.OK).json(Success(data));
      } catch (error: any) {
        logger.error(error);
        return res.status(Status.BAD_REQUEST).json(Fail(error.message));
      }
    });

  router
    .post('/', async (req: Request, res: Response) => {

    })

  router
    .put('/:id', async (req: Request, res: Response) => {

      const { body = {}, params } = req || {};
      const { id } = params;

      const values = body && Object.entries(body).length === 0;

      console.log('values values values values values values', values)

      if (!isValidObjID(id) || values)
        return res.status(Status.UNPROCESSABLE_ENTITY).json(Fail('Invalid parameters in request.'));

      try {

        const updateValue: IUser = {
          ...body,
          modified_at: Math.floor(Date.now() / 1000)
        }

        const data = await putUseCase.update({ _id: id, ...updateValue });
        logger.debug(data);
        if (!data) return res.status(Status.NOT_FOUND).json(Fail());
        return res.status(Status.OK).json(Success());
      } catch (error: any) {
        logger.error(error);
        return res.status(Status.BAD_REQUEST).json(Fail(error.message));
      }
    })

  router
    .delete('/:id', async (req: Request, res: Response) => {
      const { params } = req || {};
      const { id } = params;

      console.log('DELETE', id)

      if (!isValidObjID(id))
        return res.status(Status.UNPROCESSABLE_ENTITY).json(Fail('Invalid id parameters in request.'));

      try {
        const data = await deleteUseCase.remove({ _id: id });
        logger.debug(data);
        if (!data) return res.status(Status.NOT_FOUND).json(Fail());
        return res.status(Status.OK).json(Success());
      } catch (error: any) {
        logger.error(error);
        return res.status(Status.INTERNAL_SERVER_ERROR).json(Fail(error.message));
      }
    })

  return router;
};
