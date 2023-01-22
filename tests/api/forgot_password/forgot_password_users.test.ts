/*eslint-disable*/
import request from 'supertest';
import { faker } from '@faker-js/faker';
// we import a function that we wrote to create a new instance of Apollo Server
import container from '../../../src/container';
//import { smtpTransport } from '../../../src/nodemailer';

const containerServer: any = container.resolve('server');
const jwt = container.resolve('jwt') as any;
const { usersRepository } = container.resolve('repository');
const randomEmail = faker.internet.email();
const randomUserName = faker.internet.userName();
const password = "$2a$10$5DgmInxX6fJGminwlgv2jeMoO.28z0A6HXN.tBE7vhmPxo1LwTWaG";
const signIn = jwt.signin();
let token: string;
const createdAt = Math.floor(Date.now() / 1000);

import { clear, close, connect } from '../../dbHandler';

// this is the query for our test
beforeAll(async () => await connect());
beforeEach((done) => {
  usersRepository
    .register({
      email: randomEmail,
      username: randomUserName,
      password: password,
      created_at: createdAt,
      deleted_at: 0,
      last_connected_at: null,
    })
    .then((user: { _id: any; email: any; username: any; password: any }) => {
      token = signIn({
        _id: user._id,
        email: user.email,
        username: user.username,
        password: user.password,
      });
      console.log('token', token);
      done();
    });
});
afterEach(async () => await clear());
afterAll(async () => await close());

const sendMailMock = jest.fn()
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockImplementation(() => ({
    sendMail: sendMailMock,
  })),
}))

describe('e2e demo', () => {
  let server: { stop: () => any; }, url: any, serverStandalone: any;

  // before the tests we spin up a new Apollo Server
  beforeAll(async () => {
    // Note we must wrap our object destructuring in parentheses because we already declared these variables
    // We pass in the port as 0 to let the server pick its own ephemeral port for testing
    ({ server, serverStandalone } = await containerServer);
    ({ url } = await serverStandalone)
  });

  afterAll(async () => {
    await server?.stop();
  });

  it('says hello', async () => {
    const queryData = {
      query: `mutation ForgotPassword($email: String!) {
        forgotPassword(email: $email) {
          success
        }
      }`,
      variables: {
          email: randomEmail,
      },
    };

    const response: any = await request(url).post('/').send(queryData);

    console.log('response', response?.body)

    //const token = response?.body?.data?.signin;
   // expect(token).toBeDefined();
    expect(response.errors).toBeUndefined();
  });
});
