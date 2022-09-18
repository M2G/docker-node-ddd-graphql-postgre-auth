/*eslint-disable*/
import { ApolloServer, gql } from 'apollo-server-express';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core';
import express from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';

import http from 'http';

export default ({ config, logger, auth, schema, database }: any) => {
  const typeDefs = gql(
    readFileSync(join(__dirname, '../..', 'schema.graphql'), 'utf-8'),
  );
  console.log('STARRRRRRRRRRRRRRRRT', database)

  const app = express();

  const httpServer = http.createServer(app);
  const apolloServer = new ApolloServer({
    //typeDefs: schema.typeDefs,
    typeDefs,
    resolvers: schema.resolvers,
    // resolvers,
    context: () => database.models,
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });

  app.disable('x-powered-by');
  app.use(auth.initialize())
  // app.use(router);

  return {
    app,
    start: () => new Promise(() => {
      app.listen(config.port, async () => {
        await apolloServer.start();
        apolloServer.applyMiddleware({ app });
        logger.info(`🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`);
      })
    })
  }
}
