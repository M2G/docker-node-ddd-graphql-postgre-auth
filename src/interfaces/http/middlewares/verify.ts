/*eslint-disable*/
import { Router, Request, Response, NextFunction } from 'express';
import Status from 'http-status';

const time =
  process.env.NODE_ENV === 'development'
    ? '60s'  //process.env.JWT_TOKEN_EXPIRE_TIME
    : '2s';

const TOKEN_EXPIRED_ERROR = 'TokenExpiredError';
const FAIL_AUTH = 'Failed to authenticate token is expired.';

export default ({ jwt }: any) => {}
