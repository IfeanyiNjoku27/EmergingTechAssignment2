import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import connectDB from './config/db.js';
import { typeDefs } from './schema/typeDefs.js';
import { resolvers } from './schema/resolvers.js';
import { getUser } from './middleware/auth.js';

const PORT = process.env.PORT || 4000;

// Connect to MongoDB
await connectDB();

const app = express();
const httpServer = http.createServer(app);

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  formatError: (formattedError) => {
    console.error('GraphQL Error:', formattedError);
    return formattedError;
  },
});

await server.start();

// Middleware
app.use(cookieParser());
app.use(
  '/graphql',
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  }),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req, res }) => {
      const user = await getUser(req);
      return { req, res, user };
    },
  })
);

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK', message: 'Gaming Tournaments API is running 🎮' }));

await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
console.log(`🎮 Gaming Tournaments API is live!`);
