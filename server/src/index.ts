// npm install @apollo/server express graphql cors
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import typeDefs from "./TypeDefinitions.js";
import resolvers from "./Resolvers.js";
import { DBConnect, DBObject } from "./Helpers/MySQL.js";

import CreateContext from "./Middleware/CreateContext.js";
import formatError from "./Middleware/FormatError.js";
import fs from "fs";
import CONFIG from "./config/config.js";


await DBConnect();

const port = 4022;
// Required logic for integrating with Express
const app = express();

const httpServer = http.createServer(app);

// Same ApolloServer initialization as before, plus the drain plugin
// for our httpServer.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer })
  ],
});
// Ensure we wait for our server to start
await server.start();

// Set up our Express middleware to handle CORS, body parsing,
// and our expressMiddleware function.
app.use(
  "/",
  cors(),
  express.json({ limit: "15mb" }),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req, res }) => {
      return await CreateContext(req, res);
    },
  })
);
// read all files in sql folder
const sqlFiles = fs.readdirSync(CONFIG.BASE + "../sql");
for (const file of sqlFiles) {
  if (!file.endsWith(".sql")) continue;
  const sql: string = fs.readFileSync(CONFIG.BASE + "../sql/" + file, "utf8").trim();
  const sqlArray: string[] = sql.split(';')
  for (const statement of sqlArray) {
    if (!statement) continue;
    await DBObject.executeDirect(statement).then(() => console.log("Table created")).catch((err) => console.log(err.message));
  }
}

await new Promise((resolve) =>
  httpServer.listen({ port }, () => resolve("Server started"))
);

console.log(`🚀 Server ready at http://localhost:${port}/`);
