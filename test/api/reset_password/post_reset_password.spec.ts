/* eslint-disable */
import request from 'supertest';
import faker from 'faker';
import { connect, clear, close } from '../../dbHandler';
import container from '../../../src/container';

const server: any = container.resolve('server');
const rqt: any = request(server.app);
const { usersRepository } = container.resolve('repository');

describe('Routes: POST Reset password', () => {
  const BASE_URI = '/api/reset_password';
  const randomEmail = faker.internet.email();
  const randomUserName = faker.internet.userName();
  const randomPassword = faker.internet.password();
  const randomPassword2 = faker.internet.password();

  let token: any;

  beforeAll(async () => await connect());
  beforeEach((done) => {
    // we need to add user before we can request our token
     usersRepository.register({
       email: randomEmail.toLowerCase(),
       username: randomUserName,
       password: randomPassword,
      }).then(() => {

      usersRepository.forgotPassword({
        email: randomEmail.toLowerCase(),
        //@ts-ignore
      }).then((data) => {
        const { ...params } = data;
        token = params.reset_password_token;
        return done();
      });
     });
  });
  afterEach(async () => await clear());
  afterAll(async () => await close());


  it('should return success true', (done) => {
   rqt
      .post(BASE_URI)
      .set('Authorization', `Bearer ${token}`)
      .send({
        new_password: randomPassword2,
        verify_password: randomPassword2
      })
      .expect(200)
      .end((err: any, res: any) => {
        expect(err).toBeFalsy();
        expect(res.body.data).toHaveProperty('success', true);
        done();
      });
  });

  it('shouldnt register user return error empty new_password was sent', (done) => {
    rqt
      .post(BASE_URI)
      .set('Authorization', `Bearer ${token}`)
      .send({
        new_password: '',
      })
      .expect(422)
      .end((err: any, res: any) => {
        expect(err).toBeFalsy();
        expect(res.body.success).toBeFalsy();
        expect(res.body.error).toEqual('Invalid parameters in request.');
        done();
      });
  });

  it('shouldnt register user return error empty verify_password was sent', (done) => {
    rqt
      .post(BASE_URI)
      .set('Authorization', `Bearer ${token}`)
      .send({
        verify_password: '',
      })
      .expect(422)
      .end((err: any, res: any) => {
        expect(err).toBeFalsy();
        expect(res.body.success).toBeFalsy();
        expect(res.body.error).toEqual('Invalid parameters in request.');
        done();
      });
  });

  it('shouldnt register user return error new_password is not equal verify_password was sent', (done) => {
    rqt
      .post(BASE_URI)
      .set('Authorization', `Bearer ${token}`)
      .send({
        new_password: 'test',
        verify_password: 'test2'
      })
      .expect(422)
      .end((err: any, res: any) => {
        expect(err).toBeFalsy();
        expect(res.body.success).toBeFalsy();
        expect(res.body.error).toEqual('Invalid parameters in request.');
        done();
      });
  });

  it('shouldnt register user return error no token was sent', (done) => {
    rqt
      .post(BASE_URI)
      .send({
        new_password: 'test',
        verify_password: 'test'
      })
      .expect(422)
      .end((err: any, res: any) => {
        expect(err).toBeFalsy();
        expect(res.body.success).toBeFalsy();
        expect(res.body.error).toEqual('Invalid parameters in request.');
        done();
      });
  });
});
