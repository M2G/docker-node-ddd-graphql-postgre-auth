import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';
import { ApolloServerPluginLandingPageGraphQLPlayground } from '@apollo/server-plugin-landing-page-graphql-playground';
import { startStandaloneServer } from '@apollo/server/standalone';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { json } from 'body-parser';

export default ({ config, logger, auth, schema, verify }: any) => {
  const app = express();

  const httpServer = http.createServer(app);
  const apolloServer = new ApolloServer({
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

  app.use(
    cors({
      credentials: true,
      origin: true,
    }),
  );
  app.disable('x-powered-by');
  app.use(auth.initialize());
  // app.use(auth.authenticate); //TODO to mv to autorization like dis

  /*
  const myContextFunction: ApolloFastifyContextFunction<MyContext> = async (request, reply) => ({
  authorization: await isAuthorized(request.headers.authorization),
});

await fastify.register(fastifyApollo(apollo), {
  context: myContextFunction,
});

   */

  return {
    server: apolloServer,
    serverStandalone:
      process.env.NODE_ENV === 'test' &&
      startStandaloneServer(apolloServer, { listen: config.port }),
    app,
    start: async (): Promise<unknown> =>
      new Promise(() => {
        if (process.env.NODE_ENV === 'development') {
          return app.listen(config.port, async () => {
            console.log('config.port config.port', config.port);
            await apolloServer.start();
            app.use(
              '/graphql',
              cors(),
              json(),
              expressMiddleware(apolloServer, {
                context: verify.authorization,
              }),
            );
            logger.info(`🚀 Server ready at http://localhost:8181/graphql`);
          });
        }
      }),
  };
};
