/*eslint-disable*/
import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginCacheControl,
} from 'apollo-server-core';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { GraphQLError } from "graphql";
import { ApolloServerPlugin } from "apollo-server-plugin-base";

// CORS configuration
const whitelist = ['http://localhost:3000'];

const corsOptionsDelegate = function (req: { header: (arg0: string) => string; }, callback: (arg0: void, arg1: { origin: boolean; credentials: boolean; }) => void) {
  let corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true, credentials: true };
  } else {
    corsOptions = { origin: false, credentials: true };
  }
  callback(console.error('cors triggered twice'), corsOptions);
}

const customError401Plugin: ApolloServerPlugin = {
  requestDidStart: () => ({
    willSendResponse({ errors, response }) {
      if (response && response.http) {
        if (
          errors &&
          errors.some(
            (err: GraphQLError) => err.name === 'AuthenticationError' || err.message === 'Response not successful: Received status code 401'
          )
        ) {
          response.data = undefined;
          response.http.status = 401;
        }
      }
    },
  }),
};

export default ({ config, logger, auth, schema, verify }: any) => {
  const app = express();

  const httpServer = http.createServer(app);
  const apolloServer = new ApolloServer({
    typeDefs: schema.typeDefs,
    resolvers: schema.resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [
      customError401Plugin,
      ApolloServerPluginCacheControl({ defaultMaxAge: 5 }),
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageGraphQLPlayground({}),
    ],
    introspection: true,
    context: async ({ ...args }: any) => {
     // verify.authorization({ ...args });
    },
  });


 app.use(cors(corsOptionsDelegate))
  app.disable('x-powered-by');

  app.use(auth.initialize());
  // app.use(auth.authenticate);
  // app.use(verify.authorization);

  return {
    app,
    start: () => new Promise(() => {
      app.listen(config.port, async () => {
        console.log('config.port config.port', config.port)
        await apolloServer.start();
        apolloServer.applyMiddleware({ app, cors: false });
        logger.info(`🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`);
      })
    })
  }
}
