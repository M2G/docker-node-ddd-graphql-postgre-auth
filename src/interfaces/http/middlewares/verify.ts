/*eslint-disable*/
import { Request, Response, NextFunction } from 'express';
import Status from 'http-status';

const time =
  process.env.NODE_ENV === 'development'
    ? '60s'  //process.env.JWT_TOKEN_EXPIRE_TIME
    : '2s';

const TOKEN_EXPIRED_ERROR = 'TokenExpiredError';
const FAIL_AUTH = 'Failed to authenticate token is expired.';

export default ({ response: { Success, Fail }, jwt }: any) => {
  return {
    authorization: (req: Request, res: Response, next: NextFunction) => {
      const extractToken =
        req?.headers?.authorization?.startsWith('Bearer ');

      if (extractToken) {
        const token = req?.headers?.authorization?.split(' ')?.[1];

        try {
          jwt.verify({ maxAge: time })(token);
        } catch (e: any) {
          if (e.name === TOKEN_EXPIRED_ERROR) {
            return res.status(Status.UNAUTHORIZED).json(
              Fail({
                success: false,
                expireTime: true,
                message: FAIL_AUTH,
              }),
            );
          }

          return res.status(Status.BAD_REQUEST).json(
            Fail({
              success: false,
              message: Status[Status.BAD_REQUEST],
            }),
          );
        }

        return next();
      }

      return res.status(Status.UNAUTHORIZED).json(
        Fail({
          success: false,
          message: 'No token provided.',
        }));
    }
  }
}
