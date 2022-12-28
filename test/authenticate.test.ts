/*eslint-disable*/
// import { readFileSync } from 'fs';
//import { makeExecutableSchema } from '@graphql-tools/schema';
//import { graphql } from 'graphql';
// the actual resolvers
// import resolvers from '../src/resolvers';
// the mock service
//import authenticate from 'interfaces/http/modules/authenticate';
//import mockAuthService from './mockAuthService';
//import { join } from 'path';

/*
const { resolvers: authenticateResolvers } =
  authenticate().authenticate;

console.log('-------->', authenticateResolvers);*/

console.log('ok')

/*
const allAuthTestCase = {
  id: '',
  query: `
      query {
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
    `,
  variables: {},

  // injecting the mock movie service with canned responses
  context: { authService: mockAuthService },

  // expected result
  expected: {
    data: {
      users: [
      ],
    },
  },
};

describe('My Test Cases', () => {
  // array of all test cases, just 1 for now
  const cases = [allAuthTestCase];
  // reading the actual schema
  const typeDefs = readFileSync(join(__dirname, '../..', 'auth.graphql'), 'utf-8');

  console.log('typeDefs', typeDefs);

  // make the actual schema and resolvers executable
  // @ts-ignore
  const schema = makeExecutableSchema({ typeDefs, resolvers: authenticateResolvers });

  // running the test for each case in the cases array
  cases.forEach((obj) => {
    const {
 id, query, variables, context, expected,
} = obj;

    test(`query: ${id}`, async () => {
      // @ts-ignore
      const result = await graphql({
        schema,
        rootValue: query,
        contextValue: context,
        variableValues: variables,
      });

      console.log('result', result);

      expect(result).toEqual(expected);
    });
  });
});
*/
