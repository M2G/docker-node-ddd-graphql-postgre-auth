/*eslint-disable*/
// we import a function that we wrote to create a new instance of Apollo Server
import container from 'container';

const containerServer: any = container.resolve('server');

// we'll use supertest to test our server
import request from 'supertest';

// this is the query for our test
const queryData = {
    query: `query GetBooksByLibrary {
    libraries {
      books {
        title
        author {
          name
        }
      }
    }
  }`,
};

describe('e2e demo', () => {
  let server: { stop: () => any; }, url: any, serverStandalone: any;

  // before the tests we spin up a new Apollo Server
  beforeAll(async () => {
    // Note we must wrap our object destructuring in parentheses because we already declared these variables
    // We pass in the port as 0 to let the server pick its own ephemeral port for testing
    ({ server, serverStandalone } = await containerServer);
    ({ url } = await serverStandalone)
  });

  // after the tests we'll stop the server
  afterAll(async () => {
    await server?.stop();
  });

  it('says hello', async () => {
    // send our request to the url of the test server
    const response: any = await request(url).post('/').send(queryData);
    //expect(response.errors).toBeUndefined();
    console.log('response.body', response.body);
    //expect(response.body.data?.hello).toBe('Hello world!');
  });
});
