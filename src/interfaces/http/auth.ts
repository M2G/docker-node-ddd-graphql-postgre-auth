/*eslint-disable*/
import passport from 'passport';
import BearerStrategy from 'passport-http-bearer';
import LocalStrategy from 'passport-local';
import { Strategy, ExtractJwt } from 'passport-jwt';
import Status from 'http-status';
import { Request, Response, NextFunction } from 'express';

/**
 * middleware to check the if auth vaid
 */

export default ({ repository: { usersRepository }, jwt }: any) => {};
