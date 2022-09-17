/* eslint-disable */
import request from 'supertest';
import faker from 'faker';
import { connect, clear, close } from '../../dbHandler';
import container from '../../../src/container';

const server: any = container.resolve('server');
const rqt: any = request(server.app);
const { usersRepository } = container.resolve('repository');

jest.setTimeout(20000);

describe('Routes: POST Register', () => {
  const BASE_URI = '/api/users';
  const KEY = 'LIST_USERS_TEST';
  const jwt = container.resolve('jwt') as any;
  const redis = container.resolve('redis') as any;
  const randomEmail = faker.internet.email();
  const randomUserName = faker.internet.userName();
  const randomPassword = faker.internet.password();
  const signIn = jwt.signin({ expiresIn: 0.1 * 60 });
  const signIn2 = jwt.signin();
  let token: any;
  let token2: any;
  beforeAll(async () => await connect());
  beforeEach((done) => {

    redis.set(KEY, JSON.stringify([
      {
        "_id": 1080,
        "email": randomEmail,
        "username": randomUserName,
        "password": randomPassword,
      }
    ]));

    // we need to add user before we can request our token
        usersRepository.register({
          "email": randomEmail,
          "username": randomUserName,
          "password": randomPassword,
        })
      .then((user: { _id: any; email: any; username: any, password: any }) => {
        token = signIn({
          _id: user._id,
          email: user.email,
          username: user.username,
          password: user.password,
        });
        token2 = signIn2({
          _id: user._id,
          email: user.email,
          username: user.username,
          password: user.password,
        });

        done();
      })
  });

  afterEach(async () => await clear());
  afterAll(async () => await close());

    it('should return users list', (done) => {
      rqt
        .get(BASE_URI)
        .set('Authorization', `Bearer ${token2}`)
        .expect(200)
        .end((err: any, res: any) => {
          expect(err).toBeFalsy();
          expect(res.body.data.length).toEqual(1);
          done();
        });
    });

    it('should return unauthorized token invalid signature', (done) => {
      rqt
        .get(BASE_URI)
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTM5LCJ1c2VybmFtZSI6InRlc3QiLCJwYXNzd29yZCI6IiQyYiQxMCRoTTBy1ONWk3OE1FUndSNDJGSVllWjVzeEtsWHFQQWtRTmxkb1VqOTdSaGs2MWRjUjRJLiIsImlhdCI6MTYyNjIyMzU3NCwiZXhwIjoxNjI2MjU5NTc0fQ.yRAM-ZuNaUoKmUWX2BmacSB7LeHg2tIHawoc5-EXXSU',
        )
        .expect(400)
        .end((err: any, res: any) => {
          expect(err).toBeFalsy();
          expect(res.success).toBeFalsy();
          expect(JSON.parse(res.text).error.success).toBeFalsy();
          expect(JSON.parse(res.text).error.message).toEqual(
            'Bad Request',
          );
          done();
        });
    });

    //@see: https://github.com/auth0/node-jsonwebtoken/issues/288
    it('should return unauthorized token is expired', (done) => {
      setTimeout(function() {
        rqt
          .get(BASE_URI)
        .set('Authorization', `Bearer ${token}`)
        .expect(401)
        .end((err: any, res: any) => {
          expect(err).toBeFalsy();
          expect(JSON.parse(res.text).error.success).toBeFalsy();
          expect(JSON.parse(res.text).error.message).toEqual('Failed to authenticate token is expired.');
          done(err);
        });
      }, 2500);
    });

    it('should return unauthorized if no token', (done) => {
      rqt
        .get(BASE_URI)
        .expect(401)
        .end((err: any, res: any) => {
          expect(err).toBeFalsy();
          expect(JSON.parse(res.text).error.false).toBeFalsy();
          expect(JSON.parse(res.text).error.message).toEqual(
            'No token provided.',
          );
          done();
        });
    });
});
