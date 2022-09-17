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

export default ({ repository: { usersRepository }, response: { Fail }, jwt }: any) => {
  // @ts-ignore
  const bearerStrategy = new BearerStrategy(
    'bearer',
    (token: any, done: (arg0: any, arg1: { email: any; password: any } | null) => any) => {
      const { email }: any | number = jwt.decode()(token);

      usersRepository
        .findOne({ email })
        .then((user: any) => {
          if (!user) return done(Status[Status.NOT_FOUND], null);
          done(null, { email: user.email, password: user.password });
        })
        .catch((error: null) => done(error, null));
    },
  );

  // @ts-ignore
  const localStrategy = new LocalStrategy(
    function (username: any, password: any, done: any) {
    console.log('LocalStrategy', { username, password });

    /*
      User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (!user.verifyPassword(password)) { return done(null, false); }
        return done(null, user);
      });*/
  });

  const opts: any = {}
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = 'secret';
  opts.issuer = 'accounts.examplesoft.com';
  opts.audience = 'yoursite.net';

  const jwtStrategy = new Strategy(opts,
    function(jwt_payload, done) {

    console.log('jwt_payload', jwt_payload);

    /*
    User.findOne({id: jwt_payload.sub}, function(err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
        // or you could create a new account
      }
    });*/
  });

  passport.use(jwtStrategy);
  passport.use(localStrategy);
  passport.use(bearerStrategy);
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user: any, done) => done(null, user));

  return {
    initialize: () => passport.initialize(),
    authenticate: (req: Request, res: Response, next: NextFunction) =>
      passport.authenticate('bearer', { session: false }, (err, _) => {
        if (err === Status[Status.NOT_FOUND]) {
          return res.status(Status.NOT_FOUND).json(Fail(Status[Status.NOT_FOUND]));
        }

        if (err) {
          return res.status(Status.UNAUTHORIZED).json(Fail(Status[Status.UNAUTHORIZED]));
        }

        return next();
      })(req, res, next),
  };
};
