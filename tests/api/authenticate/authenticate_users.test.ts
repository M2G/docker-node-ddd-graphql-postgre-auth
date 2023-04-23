/*eslint-disable*/

import request from 'supertest';
import { faker } from '@faker-js/faker';
// we import a function that we wrote to create a new instance of Apollo Server
import container from 'src/container';

const containerServer: any = container.resolve('server');
const jwt = container.resolve('jwt') as any;
const { usersRepository } = container.resolve('repository');
const randomEmail = faker.internet.email();
const randomUserName = faker.internet.userName();
const password = "$2a$10$5DgmInxX6fJGminwlgv2jeMoO.28z0A6HXN.tBE7vhmPxo1LwTWaG";
const signIn = jwt.signin();
let userId: number;
let token: string;
const createdAt = Math.floor(Date.now() / 1000);

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
      .then((user: { id: any; email: any; username: any; password: any }) => {

        console.log('user user user user', user);
        userId = user.id;
        token = signIn({
          id: user.id,
          email: user.email,
          username: user.username,
          password: user.password,
        });
        console.log('token', token);
        done();
      });
});
afterEach( () => {
  usersRepository.remove({ id: userId });
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
      query: `mutation Signin($input: SigninInput) {
        signin(input: $input)
      }`,
      variables: {
        input: {
          email: randomEmail,
          password: "test",
        },
      },
    };

    const response: any = await request(url).post('/').send(queryData);
    const token = response?.body?.data?.signin;
    expect(token).toBeDefined();
    expect(response.errors).toBeUndefined();
  });
});
