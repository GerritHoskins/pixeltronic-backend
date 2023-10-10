import 'dotenv/config';
import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './connect';
import auth from './routes/auth';
import project from './routes/project';
import { adminAuth, userAuth } from './auth/auth';
import { verify_signature } from './config/webhooks';
import { Env, getEnv } from './config/env';
import { exec } from 'child_process';
import { upload } from './storage';
import * as fs from 'fs';
import path from 'path';
import FileUpload from './model/file';

const app: Express = express();
const PORT: string = getEnv(Env.PORT);

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.post('/', upload.single('file'), async (req, res) => {
  const { file } = req;
  if (!file) {
    console.error(`Missing file req param`);
    return res.status(400).send('Failed to upload file.');
  }
  try {
    const fileUpload = await FileUpload.create({
      data: fs.readFileSync(path.join(__dirname + 'assets/uploads/' + file.filename)),
      contentType: 'image/png',
    });
    console.log(fileUpload);
    res.redirect('/');
  } catch (err) {
    console.log(err);
    return res.status(500).send('Failed to upload file.');
  }
});
app.post(getEnv(Env.WEBHOOK_GITHUB_SYNC_URL), (req: Request, res: Response) => {
  if (!verify_signature(req)) {
    res.status(401).send('Unauthorized');
    return;
  }
  exec('git pull', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send('Failed to pull from git');
    }
    if (stderr) {
      console.warn(`git warnings: ${stderr}`);
    }
    console.log(`git repo: ${stdout}`);
    res.status(200).send('Received and processed!');
    process.exit(1);
  });
});
app.get('/', (req: Request, res: Response) => {
  console.log('Server up and running.');
  res.send('Server up and running.');
});
app.get('/admin', adminAuth, (req, res) => res.send('Admin Route'));
app.get('/user', userAuth, (req, res) => res.send('User Route'));
app.use('/api/auth', auth);
app.use('/api/project', project);

// Define an error type
interface ErrorHandler extends Error {
  status?: number;
}

// Error Handler Middleware (placed after all other routes and middleware)
app.use((err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).send('Something broke... Please try again later');
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

process.on('uncaughtException', (err: unknown) => {
  if (err instanceof Error) {
    console.log(`An uncaught exception occurred: ${err.message}`);
  } else {
    console.log(`An unexpected exception occurred: ${err}`);
  }
  process.exit(1);
});
