/*eslint-disable*/
import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';
import express from 'express';

import http from 'http';

export default ({ config, logger, auth, schema, verify }: any) => {
  console.log('STARRRRRRRRRRRRRRRRT', {schema, auth, verify})

  const app = express();

  const httpServer = http.createServer(app);
  const apolloServer = new ApolloServer({
    typeDefs: schema.typeDefs,
    resolvers: schema.resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageGraphQLPlayground({}),
    ],
    introspection: true,
  });

  app.disable('x-powered-by');
  app.use(auth.initialize());
  app.use(auth.authenticate);
  app.use(verify.authorization);

  return {
    app,
    start: () => new Promise(() => {
      app.listen(config.port, async () => {
        console.log('config.port config.port', config.port)
        await apolloServer.start();
        apolloServer.applyMiddleware({ app });
        logger.info(`🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`);
      })
    })
  }
}
