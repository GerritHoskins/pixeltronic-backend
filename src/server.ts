import 'dotenv/config';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './db';
import router from './auth/route';
import { adminAuth, userAuth } from './auth/auth';
import { verify_signature } from './config/webhooks';
import { Env, getEnv } from './config/env';

const app: Express = express();
const PORT: string = getEnv(Env.PORT);

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.post(getEnv(Env.WEBHOOK_GITHUB_SYNC_URL), (req, res) => {
  if (!verify_signature(req)) {
    res.status(401).send('Unauthorized');
    return;
  }
  res.status(200).send('Received!');
});
app.get('/', (req: Request, res: Response) => {
  console.log('Server up and running.');
  res.send('Server up and running.');
});
app.get('/admin', adminAuth, (req, res) => res.send('Admin Route'));
app.get('/home', userAuth, (req, res) => res.send('User Route'));
app.get('/logout', (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
});
app.use('/api/auth', router);

// Define an error type
interface ErrorHandler extends Error {
  status?: number;
}

// Error Handler Middleware (placed after all other routes and middleware)
app.use((err: ErrorHandler, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(err.status || 500).send('Something broke!');
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server connected to port ${PORT}`);
    });
  } catch (error) {
    console.error(`Error connecting to database: ${error}`);
    process.exit(1);
  }
};

startServer();

process.on('unhandledRejection', (err: unknown) => {
  if (err instanceof Error) {
    console.log(`An error occurred: ${err.message}`);
  } else {
    console.log(`An unexpected rejection occurred: ${err}`);
  }
  process.exit(1);
});
