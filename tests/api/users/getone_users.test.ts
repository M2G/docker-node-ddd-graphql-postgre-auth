/*eslint-disable*/
import request from 'supertest';
import { faker } from '@faker-js/faker';
// we import a function that we wrote to create a new instance of Apollo Server
import container from 'src/container';

const containerServer: any = container.resolve('server');
const jwt = container.resolve('jwt') as any;
const { usersRepository } = container.resolve('repository');
const randomEmail = faker.internet.email();
const signIn = jwt.signin();
let token: string;
let userId: number;
const createdAt = Date.now();
const password = '$2a$10$5DgmInxX6fJGminwlgv2jeMoO.28z0A6HXN.tBE7vhmPxo1LwTWaG';

beforeEach((done) => {
  usersRepository
    .register({
      email: randomEmail,
      password: password,
      created_at: createdAt,
      deleted_at: 0,
      last_connected_at: null,
    })
    .then((user: { id: number; email: any; username: any; password: any }) => {
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

afterEach(() => {
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
      query: `query GetUser($id: Int!) {
        getUser(id: $id) {
           id
           email
           username
           created_at
           deleted_at
           last_connected_at
        }
      }`,
      variables: { id: userId },
    };

    const response: any = await request(url).post('/').send(queryData);
    const user = response?.body?.data?.getUser;

    console.log('getUser getUser getUser', response?.body)

    expect(user?.id).toBe(userId);
    expect(user?.email).toBe(randomEmail);
    expect(user?.deleted_at).toBe(0);
    expect(user?.last_connected_at).toBe(0);
  });
});
