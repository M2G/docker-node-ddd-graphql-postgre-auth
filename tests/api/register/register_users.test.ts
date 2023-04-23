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
      userId = user.id;
      token = signIn({
        _id: user.id,
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
      query: `mutation Signup($input: SignupInput) {
         signup(input: $input)
      }`,
      variables: {
        input: {
          email: randomEmail,
          password: "test",
        },
      },
    };

    const response: any = await request(url).post('/').send(queryData);
    const user = response?.body?.data?.signup;
    console.log('user user useruser', user)
    expect(response.errors).toBeUndefined();
  });
});

