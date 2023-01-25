/*eslint-disable*/
import request from 'supertest';
import { faker } from '@faker-js/faker';
// we import a function that we wrote to create a new instance of Apollo Server
import container from '../../../src/container';
import { smtpTransport } from '../../../src/nodemailer';
import { clear, close, connect } from '../../dbHandler';

const containerServer: any = container.resolve('server');
const jwt = container.resolve('jwt') as any;
const { usersRepository } = container.resolve('repository');
const randomEmail = faker.internet.email();
const randomUserName = faker.internet.userName();
const password = "$2a$10$5DgmInxX6fJGminwlgv2jeMoO.28z0A6HXN.tBE7vhmPxo1LwTWaG";
const signIn = jwt.signin();
let token: string;
const createdAt = Math.floor(Date.now() / 1000);

// this is the query for our test
beforeAll(async () => await connect());
beforeEach((done) => {

  console.log('usersRepository usersRepository usersRepository', usersRepository);

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

      usersRepository.forgotPassword({
        email: randomEmail,
      }).then((d: any) => {

        console.log('forgotPassword forgotPassword forgotPassword', d);
        done();
      });

    });

});
afterEach(async () => await clear());
afterAll(async () => await close());

const spy = jest.spyOn(smtpTransport, 'sendMail').mockImplementation(() => {
  return {
    messageId: true,
  };
});
describe('e2e demo', () => {
  let server: { stop: () => any }, url: any, serverStandalone: any;

  beforeAll(async () => {
    ({ server, serverStandalone } = await containerServer);
    ({ url } = await serverStandalone);
  });

  afterAll(async () => {
    await server?.stop();
  });

  it('says hello', async () => {
    const queryData = {
      query: `mutation ResetPassword($input: ResetPasswordInput) {
        resetPassword(input: $input) {
          success
        }
      }`,
      variables: {
        input: {
          token,
          password: "password",
        },
      },
    };

    const response: any = await request(url).post('/').send(queryData);

    console.log('response', response)

    //const token = response?.body?.data?.signin;
   // expect(token).toBeDefined();
    expect(response?.body?.data?.resetPassword?.success).toBeTruthy();
    expect(response.errors).toBeUndefined();
    expect(spy).toBeCalledTimes(1);
  });
});
