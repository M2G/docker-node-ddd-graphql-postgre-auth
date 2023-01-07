/*eslint-disable*/
import request from 'supertest';
import { faker } from '@faker-js/faker';
// we import a function that we wrote to create a new instance of Apollo Server
import container from 'container';

const containerServer: any = container.resolve('server');
const jwt = container.resolve('jwt') as any;
const { usersRepository } = container.resolve('repository');
const randomEmail = faker.internet.email();
const randomUserName = faker.internet.userName();
const signIn = jwt.signin();
let token: string;
let userId: string;
const createdAt = Math.floor(Date.now() / 1000);

import { clear, close, connect } from '../../dbHandler';

// this is the query for our test
beforeAll(async () => await connect());
beforeEach((done) => {
  usersRepository.register({
    email: randomEmail,
    username: randomUserName,
    password: '$2a$10$5DgmInxX6fJGminwlgv2jeMoO.28z0A6HXN.tBE7vhmPxo1LwTWaG',
    created_at: createdAt,
    deleted_at: 0,
    last_connected_at: null,
  }).then((user: { _id: any; email: any; username: any, password: any }) => {

    userId = user._id;

    token = signIn({
      _id: user._id,
      email: user.email,
      username: user.username,
      password: user.password,
    });
    console.log('token', token)
    done();
  });
});
afterEach(async () => await clear());
afterAll(async () => await close());

describe('e2e demo', () => {
  let server: any, url: any;

  beforeAll(async () => {
    ({ server, url } = await containerServer);
  });

  afterAll(async () => {
    await server?.stop();
  });

  it('says hello', async () => {
    const queryData = {
      query: `query getUserList($filters: String, $pageSize: Int, $page: Int) {
        users(filters: $filters, pageSize: $pageSize, page: $page) {
           results {
            _id
            first_name
            last_name
            email
            created_at
            modified_at
          }
          pageInfo {
            count
            pages
            next
            prev
          }
        }
      }`,
      variables: { filters: '', pageSize: 5, page: 1 },
    };

    const response: any = await request(url).post('/').send(queryData);
    expect(response.errors).toBeUndefined();
    expect(response?.body?.data?.users?.[0]?.results[0]?._id).toBe(userId.toString());
    expect(response?.body?.data?.users?.[0]?.results[0]?.email).toBe(randomEmail.toLowerCase());
    expect(response?.body?.data?.users?.[0]?.results[0]?.created_at).toBe(createdAt);
  });
});
