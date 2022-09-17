/* eslint-disable */
import request from 'supertest';
import faker from 'faker';
import { connect, clear, close } from '../../dbHandler';
import container from '../../../src/container';

const server: any = container.resolve('server');
const rqt: any = request(server.app);
const { usersRepository } = container.resolve('repository');

jest.setTimeout(20000);

describe('Routes: GET User', () => {
  const BASE_URI = (id: any) => `/api/users/${id}`;
  const jwt = container.resolve('jwt') as any;
  let randomUUID: any;
  const randomEmail = faker.internet.email();
  const randomUserName = faker.internet.userName();
  const randomPassword = faker.internet.password();
  const signIn = jwt.signin();
  let token: any;
  beforeAll(async () => await connect());
  beforeEach((done) => {

    // we need to add user before we can request our token
        usersRepository.register({
          email: randomEmail,
          username: randomUserName,
          password: randomPassword,
        })
      .then((user: { _id: any; email: any; username: any, password: any }) => {

        randomUUID = user._id;

        token = signIn({
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
        .get(BASE_URI(randomUUID))
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err: any, res: any) => {
          expect(err).toBeFalsy();
          expect(res.body.date).toBeDefined();
          expect(res.body.success).toEqual(true);
          expect(res.body.data._id).toEqual(randomUUID.toString());
          expect(res.body.data.email).toEqual(randomEmail.toLowerCase());
          expect(res.body.data.username).toEqual(randomUserName.toLowerCase());
          expect(res.body.data.created_at).toBeDefined();
          done();
        });
    });

    it('should return unauthorized token invalid signature', (done) => {
      rqt
        .get(BASE_URI(randomUUID))
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
          .get(BASE_URI(randomUUID))
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
        .get(BASE_URI(randomUUID))
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

  it('shouldnt register user return error empty params was sent', (done) => {
    rqt
      .get(BASE_URI('zzzzzz'))
      .set('Authorization', `Bearer ${token}`)
      .expect(422)
      .end((err: any, res: any) => {
        expect(err).toBeFalsy();
        expect(res.body.success).toBeFalsy();
        expect(res.body.error).toEqual('Invalid id parameters in request.');
        done();
      });
  });
});
