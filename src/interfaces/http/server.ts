/*eslint-disable*/
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';
import { ApolloServerPluginLandingPageGraphQLPlayground } from '@apollo/server-plugin-landing-page-graphql-playground';

import express from 'express';
import cors from 'cors';
import http from 'http';
import { json } from 'body-parser';

export default ({
 config, logger, auth, schema, verify,
}: any) => {
  const app = express();

  const httpServer = http.createServer(app);
  // @ts-ignore
  const apolloServer = new ApolloServer<any>({
    cache: 'bounded',
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
    start: async (): Promise<unknown> =>
      new Promise(() => {
        app.listen(config.port, () => {
          void (async () => {
            console.log('config.port config.port', config.port);
            //@ts-ignore
            await apolloServer.start();
            app.use(
              '/graphql',
              cors<cors.CorsRequest>(),
              json(),
              expressMiddleware(apolloServer, {
                context: verify.authorization,
              }),
            );
            logger.info(
              `🚀 Server ready at http://localhost:8181/graphql`,
            );
          })();
        });
      }),
  };
};
