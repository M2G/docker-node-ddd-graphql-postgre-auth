import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginCacheControl
} from 'apollo-server-core';
import express from 'express';
import cors from 'cors';
import http from 'http';

export default ({ config, logger, auth, schema, verify }: any) => {
  const app = express();

  const httpServer = http.createServer(app);
  const apolloServer = new ApolloServer({
    cache: 'bounded',
    context: verify.authorization,
    csrfPrevention: true,
    introspection: true,
    plugins: [
      ApolloServerPluginCacheControl({ defaultMaxAge: 5 }),
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageGraphQLPlayground({}),
    ],
    resolvers: schema.resolvers,
    typeDefs: schema.typeDefs,
  });

  app.use(cors({ credentials: true, origin: true }));
  app.disable('x-powered-by');

  app.use(auth.initialize());
  app.use(auth.authenticate);
  // app.use(verify.authorization);

  return {
    app,
    start: async () =>
      new Promise(() => {
        app.listen(config.port, async (): Promise<void> => {
          console.log('config.port config.port', config.port);
          await apolloServer.start();
          apolloServer.applyMiddleware({ app, cors: false });
          logger.info(
            `🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`,
          );
        });
      }),
  };
};
