/*eslint-disable*/
import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core';
import express from 'express';
import http from 'http';

export default ({ config, logger, auth }: any) => {
  console.log('STARRRRRRRRRRRRRRRRT')
  const app = express();
  /*const httpServer = http.createServer(app);
  const apolloServer = new ApolloServer({
    //typeDefs,
    //resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });

  app.disable('x-powered-by');
  app.use(auth.initialize())*/
  // app.use(router);

  return {
    app,
    start: () => new Promise(() => {
      app.listen(config.port, async () => {
        //await apolloServer.start();
        //apolloServer.applyMiddleware({ app });
        //logger.info(`🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`);
      })
    })
  }
}
