/*eslint-disable*/
import passport from 'passport';
import BearerStrategy from 'passport-http-bearer';
import Status from 'http-status';
import { Request, Response, NextFunction } from 'express';

/**
 * middleware to check the if auth vaid
 */

export default ({ repository: { usersRepository }, response: { Fail }, jwt }: any) => {

  const bearerStrategy = new BearerStrategy(
    'bearer',
    (token: any, done: (arg0: any, arg1: { email: any; password: any } | null) => any) => {

      const { _id, ...args }: any | number = jwt.decode()(token);

      console.log('bearerStrategy', {args, token})

      usersRepository
        .findOne({ _id })
        .then((user: any) => {
          if (!user) return done(Status[Status.NOT_FOUND], null);
          done(null, { email: user.email, password: user.password });
        })
        .catch((error: null) => done(error, null));
    },
  );

  passport.use(bearerStrategy);
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user: any, done) => done(null, user));

  return {
    initialize: () => passport.initialize(),
    authenticate: (req: Request, res: Response, next: NextFunction) => {
      return passport.authenticate('bearer', { session: false }, (err, _) => {

        console.log('passport.authenticate', err);

          if (err === Status[Status.NOT_FOUND]) {
            return res.status(Status.NOT_FOUND).json(Fail(Status[Status.NOT_FOUND]));
          }

          if (err) {
            return res.status(Status.UNAUTHORIZED).json(Fail(Status[Status.UNAUTHORIZED]));
          }

        return next();
      })(req, res, next);
    }
  };
};
