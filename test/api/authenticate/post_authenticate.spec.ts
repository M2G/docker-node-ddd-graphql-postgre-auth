/* eslint-disable */
import request from 'supertest';
import faker from 'faker';
import { connect, clear, close } from '../../dbHandler';
import container from '../../../src/container';

const server: any = container.resolve('server');
const rqt: any = request(server.app);
const { usersRepository } = container.resolve('repository');

describe('Routes: POST Auth', () => {
  const BASE_URI = '/api/authenticate';
  const randomEmail = faker.internet.email();
  const randomUserName = faker.internet.userName();

  beforeAll(async () => await connect());
  beforeEach((done) => {
    // we need to add user before we can request our token
    usersRepository.register({
      email: randomEmail,
      username: randomUserName,
      password: '$2a$10$5DgmInxX6fJGminwlgv2jeMoO.28z0A6HXN.tBE7vhmPxo1LwTWaG',
    }).then(() => done());
  });
  afterEach(async () => await clear());
  afterAll(async () => await close());


 it('should return authenticate user',  (done) => {
     rqt.post(BASE_URI)
      .send({
        email: randomEmail,
        password: 'test',
      })
       .expect(200)
      .end((err: any, res: any) => {
       expect(err).toBeFalsy();
        expect(res.body.data.token).toBeTruthy();
        expect(res.body.data.success).toBeTruthy();
        done();
      });
  });

  it('shouldnt authenticate user return error cannot find any user', (done) => {
    const randomEmail = faker.internet.email();
    const randomPassword = faker.internet.password();
    rqt
      .post(BASE_URI)
      .send({
        email: randomEmail,
        password: randomPassword,
      })
      .expect(404)
      .end((err: any, res: any) => {
        expect(err).toBeFalsy();
        expect(res.body.success).toBeFalsy();
        expect(res.body.error).toEqual(`User not found (email: ${randomEmail}).`);
        done();
      });
  });

  it('shouldnt authenticate user return error empty username was sent', (done) => {
    const randomPassword = faker.internet.password();
    rqt
      .post(BASE_URI)
      .send({
        email: '',
        password: randomPassword,
      })
      .expect(422)
      .end((err: any, res: any) => {
        expect(err).toBeFalsy();
        expect(res.body.success).toBeFalsy();
        expect(res.body.error).toEqual('Empty value.');
        done();
      });
  });

  it('shouldnt authenticate user return error empty password was sent', (done) => {
    const randomEmail = faker.internet.email();
    rqt
      .post(BASE_URI)
      .send({
        email: randomEmail,
        password: '',
      })
      .expect(422)
      .end((err: any, res: any) => {
        expect(err).toBeFalsy();
        expect(res.body.success).toBeFalsy();
        expect(res.body.error).toEqual('Empty value.');
        done();
      });
  });

  it('shouldnt authenticate user return error empty username/password was sent', (done) => {
    rqt
      .post(BASE_URI)
      .send({
        email: '',
        password: '',
      })
      .expect(422)
      .end((err: any, res: any) => {
        expect(err).toBeFalsy();
        expect(res.body.success).toBeFalsy();
        expect(res.body.error).toEqual('Empty value.');
        done();
      });
  });

  it('shouldnt authenticate user return error empty body was sent', (done) => {
    rqt
      .post(BASE_URI)
      .send({})
      .expect(422)
      .end((err: any, res: any) => {
        expect(err).toBeFalsy();
        expect(res.body.success).toBeFalsy();
        done();
      });
  });
});
