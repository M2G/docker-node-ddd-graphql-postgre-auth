import fs from 'fs';
import { makeExecutableSchema } from 'graphql-tools';
import { graphql } from 'graphql';
// the actual resolvers
// import resolvers from '../src/resolvers';
// the mock service
import mockAuthService from './mockAuthService';

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
      allMovies: [
        {
          id: '1',
          title: 'Interstellar',
          year: '2014',
          director: { firstName: 'Christopher', lastName: 'Nolan' },
        },
        {
          id: '2',
          title: 'Mad Max: Fury Road',
          year: '2015',
          director: { firstName: 'George', lastName: 'Miller' },
        },
      ],
    },
  },
};

describe('My Test Cases', () => {
  // array of all test cases, just 1 for now
  const cases = [allAuthTestCase];
  // reading the actual schema
  const typeDefs = fs.readFileSync('./src/schemas/Movie.graphql', 'utf8');
  // make the actual schema and resolvers executable
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // running the test for each case in the cases array
  cases.forEach((obj) => {
    const {
 id, query, variables, context, expected,
} = obj;

    test(`query: ${id}`, async () => {
      const result = await graphql(schema, query, null, context, variables);
      expect(result).toEqual(expected);
    });
  });
});
