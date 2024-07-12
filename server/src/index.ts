
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import typeDefs from './TypeDefinitions.js';
import resolvers from './Resolvers.js';
import { DBConnect } from './Helpers/MySQL.js';

const port = 5900;

await DBConnect()
const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

server.start().then(() => {
  app.use(
    cors(),
    bodyParser.json(),
    expressMiddleware(server),
  );

  return new Promise<void>((resolve) =>
    httpServer.listen({ port }, () => {
      console.log(`🚀 Server ready at http://localhost:${port}/`);
      resolve();
    })
  );
}).catch(console.error);