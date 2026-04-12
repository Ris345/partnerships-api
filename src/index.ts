import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { parse as parseContentType } from 'content-type';
import { typeDefs } from './graphql';
import { setCustomTypeParsers, parseTimeZoneHeader } from './util';
import { AppContext } from './model/graphql';

await setCustomTypeParsers();

const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer<AppContext>({
  typeDefs,
  resolvers: {},
  // resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

const validCharset = /^utf-(8|((16|32)(le|be)?))$/i;
app.use(
  '/',
  cors<cors.CorsRequest>(),
  express.json({
    verify(req) {
      const charset = parseContentType(req).parameters.charset || 'utf-8';
      if (!charset.match(validCharset)) {
        throw Object.assign(
          new Error(`unsupported charset "${charset.toUpperCase()}"`),
          {
            status: 415,
            name: 'UnsupportedMediaTypeError',
            charset,
            type: 'charset.unsupported',
          },
        );
      }
    },
  }),
  expressMiddleware(server, {
    context: async ({ req }) => ({
      timezone: parseTimeZoneHeader(req.headers['Time-Zone']),
    }),
  }),
);

await new Promise<void>(resolve => httpServer.listen({ port: 4000 }, resolve));

console.log(`🚀 Server ready at http://localhost:4000/`);
