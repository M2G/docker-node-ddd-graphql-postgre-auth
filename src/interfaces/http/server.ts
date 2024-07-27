import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import { startStandaloneServer } from '@apollo/server/standalone';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { json } from 'body-parser';
import Status from 'http-status';

const setHttpPlugin = {
  async requestDidStart() {
    return {
      async willSendResponse(ctx: {
        response: { body: { singleResult: { errors: any[] } }; http: { status: number } };
      }) {
        const message: string = ctx.response.body.singleResult.errors?.[0]?.message;

        if (
          message?.includes('User not found') ||
          message?.includes('Wrong username and password combination')
        ) {
          ctx.response.http.status = Status.UNAUTHORIZED;
        }

        if (
          message?.includes('Refresh Token is required') ||
          message?.includes('Refresh token is not in database') ||
          message?.includes('Refresh token was expired. Please make a new signin request')
        ) {
          ctx.response.http.status = Status.FORBIDDEN;
        }

        /*
        if (
          message === Errors.WRONG_COMBINATION ||
          message === Errors.CHANGE_PASSWORD_MATCH_ERROR
        ) {
          ctx.response.http.status = Status.UNAUTHORIZED;
        }

        if (message === Errors.DUPLICATE_ERROR) {
          ctx.response.http.status = Status.CONFLICT;
        }

        if (
          message === Errors.REFRESH_TOKEN_REQUIRED ||
          message === Errors.REFRESH_TOKEN_NOT_FOUND ||
          message === Errors.REFRESH_TOKEN_EXPIRED
        ) {
          ctx.response.http.status = Status.FORBIDDEN;
        }*/

        return ctx;
      },
    };
  },
};

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
      process.env.NODE_ENV === 'production'
        ? ApolloServerPluginLandingPageProductionDefault({
            graphRef: 'my-graph-id@my-graph-variant',
            footer: false,
          })
        : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
      setHttpPlugin,
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
  app.use(auth.authenticate);

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
