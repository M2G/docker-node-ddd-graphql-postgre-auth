import type { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import BearerStrategy from 'passport-http-bearer';
import Status from 'http-status';

/**
 * middleware to check the if auth vaid
 */

export default ({ repository: { usersRepository }, response: { Fail }, jwt }: any) => {
  const bearerStrategy: any = new BearerStrategy(
    'bearer',
    (token: string, done: (arg0: any, arg1: { email: string; password: string } | null) => any) => {
      const { id }: number = jwt.decode()(token);

      console.log('bearerStrategy', {
        id,
        token,
        usersRepository,
      });

      usersRepository
        .findOne({ id })
        .then((user: { email: any; password: any }) => {
          if (!user) return done(Status[Status.NOT_FOUND], null);
          done(null, { email: user.email, password: user.password });
        })
        .catch((error: null) => done(error, null));
    },
  );

  passport.use(bearerStrategy);
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user as any));

  return {
    authenticate: (req: Request, res: Response, next: NextFunction) =>
      passport.authenticate('bearer', { session: false }, (err: string, _: any) => {
        if (err === Status[Status.NOT_FOUND]) {
          return res.status(Status.NOT_FOUND).json(Fail({ message: Status[Status.NOT_FOUND] }));
        }

        if (err) {
          return res.status(Status.UNAUTHORIZED).json(Fail(Status[Status.UNAUTHORIZED]));
        }

        next();
      })(req, res, next),
    initialize: () => passport.initialize(),
  };
};
