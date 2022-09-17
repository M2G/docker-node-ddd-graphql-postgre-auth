/* eslint-disable */
import request from 'supertest';
import faker from 'faker';
import { connect, clear, close } from '../../dbHandler';
import container from '../../../src/container';

const server: any = container.resolve('server');
const rqt: any = request(server.app);
const { usersRepository } = container.resolve('repository');

describe('Routes: POST Register', () => {
  const BASE_URI = '/api/register';
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


  it('should return register user', (done) => {
    const randomEmail = faker.internet.email();
    const randomUserName = faker.internet.userName();
    const randomPassword = faker.internet.password();
   rqt
      .post(BASE_URI)
      .send({
        email: randomEmail,
        username: randomUserName,
        password: randomPassword,
      })
      .expect(200)
      .end((err: any, res: any) => {

        console.log('res res res res res', res)

        expect(err).toBeFalsy();
        expect(res.body.data).toHaveProperty('success', true);
        expect(res.body.data).toHaveProperty('token');
        done();
      });
  });

  it('shouldnt register user return error empty email/username was sent', (done) => {
    const randomEmail = faker.internet.email();
    const randomUserName = faker.internet.userName();
    rqt
      .post(BASE_URI)
      .send({
        email: randomEmail,
        username: randomUserName,
        password: '',
      })
      .expect(422)
      .end((err: any, res: any) => {
        expect(err).toBeFalsy();
        expect(res.body.success).toBeFalsy();
        expect(res.body.error).toEqual('Invalid parameters in request.');
        done();
      });
  });

  it('shouldnt register user return error empty username/password was sent', (done) => {
    const randomUserName = faker.internet.userName();
    const randomPassword = faker.internet.password();
    rqt
      .post(BASE_URI)
      .send({
        email: '',
        username: randomUserName,
        password: randomPassword,
      })
      .expect(422)
      .end((err: any, res: any) => {
        expect(err).toBeFalsy();
        expect(res.body.success).toBeFalsy();
        expect(res.body.error).toEqual('Invalid parameters in request.');
        done();
      });
  });

  it('shouldnt register user return error empty password was sent', (done) => {
    const randomUserName = faker.internet.userName();
    rqt
      .post(`/api/register`)
      .send({
        email: '',
        username: randomUserName,
        password: '',
      })
      .expect(422)
      .end((err: any, res: any) => {
        expect(err).toBeFalsy();
        expect(res.body.success).toBeFalsy();
        expect(res.body.error).toEqual('Invalid parameters in request.');
        done();
      });
  });

  it('shouldnt authenticate user return error empty body was sent', (done) => {
    rqt
      .post(`/api/register`)
      .send({})
      .expect(422)
      .end((err: any, res: any) => {
        expect(err).toBeFalsy();
        expect(res.body.success).toBeFalsy();
        done();
      });
  });

  it('should return error duplicate registered user', (done) => {
    rqt
      .post(`/api/register`)
      .send({
        email: randomEmail,
        username: randomUserName,
        password: randomPassword,
      })
      .expect(500)
      .end((err: any, res: any) => {
        expect(err).toBeFalsy();
        expect(res.body.error).toEqual(`MongoServerError: E11000 duplicate key error collection: test.users index: email_1 dup key: { email: \"${randomEmail.toLowerCase()}\" }`);
        done();
      });
  });
});
