/* eslint-disable */
import request from 'supertest';
import faker from 'faker';
import { connect, clear, close } from '../../dbHandler';
import container from '../../../src/container';

const server: any = container.resolve('server');
const rqt: any = request(server.app);
const { usersRepository } = container.resolve('repository');

describe('Routes: POST Forgot password', () => {
  const BASE_URI = '/api/forgot_password';
  const randomEmail = faker.internet.email();
  const randomUserName = faker.internet.userName();
  const randomPassword = faker.internet.password();

  beforeAll(async () => await connect());
  beforeEach((done) => {
    // we need to add user before we can request our token
     usersRepository.register({
       email: randomEmail,
       username: randomUserName,
       password: randomPassword,
      }).then(() => done());
  });
  afterEach(async () => await clear());
  afterAll(async () => await close());


  it('should return success true', (done) => {
   rqt
      .post(BASE_URI)
      .send({
        email: randomEmail,
      })
      .expect(200)
      .end((err: any, res: any) => {
        expect(err).toBeFalsy();
        expect(res.body.data).toHaveProperty('success', true);
        done();
      });
  });

  it('shouldnt register user return error empty email was sent', (done) => {
    rqt
      .post(BASE_URI)
      .send({
        email: '',
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
