/*eslint-disable*/
import request from 'supertest';
import { faker } from '@faker-js/faker';
// we import a function that we wrote to create a new instance of Apollo Server
import container from 'src/container';
import { smtpTransport } from 'src/nodemailer';
const containerServer: any = container.resolve('server');
const { usersRepository } = container.resolve('repository');
const randomEmail = faker.internet.email();
const randomUserName = faker.internet.userName();
const password = '$2a$10$5DgmInxX6fJGminwlgv2jeMoO.28z0A6HXN.tBE7vhmPxo1LwTWaG';
let userId: number;
let token: string;
const createdAt = Math.floor(Date.now() / 1000);

function sleep(time: number | undefined) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

// this is the query for our test
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
    .then((user: { id: number; }) => {
      userId = user.id;
      usersRepository.forgotPassword({ email: randomEmail });
      sleep(2000).then(async () => {
        const data = await usersRepository.findOne({ id: userId });
        token = data?.reset_password_token;
        done();
      });
    })
});

afterEach(() => {
  usersRepository.remove({ id: userId });
});

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
      query: `mutation ResetPassword($input: ResetPasswordInput!) {
        resetPassword(input: $input) {
          success
        }
      }`,
      variables: {
        input: {
          token,
          password: 'password',
        },
      },
    };

    const response: any = await request(url).post('/').send(queryData);
    expect(response?.body?.data?.resetPassword?.success).toBeTruthy();
    expect(response.errors).toBeUndefined();
    expect(spy).toBeCalledTimes(1);
  });
});
