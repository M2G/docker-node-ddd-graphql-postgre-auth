/*eslint-disable*/
import request from 'supertest';
import { faker } from '@faker-js/faker';
// we import a function that we wrote to create a new instance of Apollo Server
import container from '../../../src/container';
import { smtpTransport } from '../../../src/nodemailer';
import { clear, close, connect } from '../../dbHandler';

const containerServer: any = container.resolve('server');
const { usersRepository } = container.resolve('repository');
const randomEmail = faker.internet.email();
const randomUserName = faker.internet.userName();
const password = "$2a$10$5DgmInxX6fJGminwlgv2jeMoO.28z0A6HXN.tBE7vhmPxo1LwTWaG";
let user: any;
const createdAt = Math.floor(Date.now() / 1000);

// this is the query for our test
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
    .then(() => {
       usersRepository.forgotPassword({
        email: randomEmail,
      }).then((data: any) => {
         user = data
        console.log('forgotPassword forgotPassword forgotPassword', data);
        done();
      });
    });

});

const spy = jest.spyOn(smtpTransport, 'sendMail').mockImplementation(() => {
  return {
    messageId: true,
  };
});
describe('e2e demo', () => {
  let server: { stop: () => any }, url: any, serverStandalone: any;

  beforeAll(async () => {
    await connect();
    ({ server, serverStandalone } = await containerServer);
    ({ url } = await serverStandalone);
  });

  afterEach(async () => await clear());

  afterAll(async () => {
    await close();
    await server?.stop();
  });

  it('says hello', async () => {

    console.log('user?.reset_password_token', user)

    const queryData = {
      query: `mutation ResetPassword($input: ResetPasswordInput!) {
        resetPassword(input: $input) {
          success
        }
      }`,
      variables: {
        input: {
          token: user?.reset_password_token || '',
          password: "password",
        },
      },
    };

    const response: any = await request(url).post('/').send(queryData);

    console.log('response', response)

    //const token = response?.body?.data?.signin;
   // expect(token).toBeDefined();
   // expect(response?.body?.data?.resetPassword?.success).toBeTruthy();
    //expect(response.errors).toBeUndefined();
    expect(spy).toBeCalledTimes(1);
  });
});
