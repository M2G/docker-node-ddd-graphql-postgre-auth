/*eslint-disable*/
import request from 'supertest';
// import { faker } from '@faker-js/faker';
// we import a function that we wrote to create a new instance of Apollo Server
import container from '../src/container';

const containerServer: any = container.resolve('server');
/*
const { usersRepository } = container.resolve('repository');
const randomEmail = faker.internet.email();
const randomUserName = faker.internet.userName();*/
// we'll use supertest to test our server

import { clear, close, connect } from './dbHandler';

// this is the query for our test
beforeAll(async () => await connect());
beforeEach((done) => {
  /*usersRepository.register({
    email: randomEmail,
    username: randomUserName,
    password: '$2a$10$5DgmInxX6fJGminwlgv2jeMoO.28z0A6HXN.tBE7vhmPxo1LwTWaG',
  }).then(() => done());*/
  done();
});
afterEach(async () => await clear());
afterAll(async () => await close());

const queryData = {
  query: `query GetUserList($filters: String, $pageSize: Int, $page: Int) {
    users(filters: $filters, pageSize: $pageSize, page: $page) {
      results {
         _id
          first_name
          last_name
          email
          created_at
          modified_at
          password
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

describe('e2e demo', () => {
  // @ts-ignore
  let server, url: any;

  // before the tests we spin up a new Apollo Server
  beforeAll(async () => {
    // Note we must wrap our object destructuring in parentheses because we already declared these variables
    // We pass in the port as 0 to let the server pick its own ephemeral port for testing
    ({ server, url } = await containerServer);
  });

  // after the tests we'll stop the server
  afterAll(async () => {
    // @ts-ignore
    await server?.stop();
  });

  it('says hello', async () => {
    // send our request to the url of the test server
    const response: any = await request(url).post('/').send(queryData);

    console.log('response response ', response.body)
    //expect(response.errors).toBeUndefined();
    //expect(response.body.data?.hello).toBe('Hello world!');
  });
});
