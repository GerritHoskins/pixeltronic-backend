import 'dotenv/config';
import express, {Express, NextFunction, Request, Response} from 'express';
// @ts-ignore
import cookieParser from 'cookie-parser';
import connectDB from './db';
import router from './auth/route';
import {adminAuth, userAuth} from './auth/auth';

const app: Express = express();
const PORT: number | string = process.env.PORT || 0;

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.get('/', (req: Request, res: Response) => {
    console.log('Server up and running.');
    res.send('Server up and running.');
});
app.get('/admin', adminAuth, (req, res) => res.send('Admin Route'));
app.get('/basic', userAuth, (req, res) => res.send('User Route'));
app.get('/logout', (req, res) => {
    res.cookie('jwt', '', {maxAge: 1})
    res.redirect('/')
})
app.use('/api/auth', router);

// Define an error type
interface ErrorHandler extends Error {
    status?: number;
}

// Error Handler Middleware (placed after all other routes and middleware)
app.use((err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
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

process.on('unhandledRejection', (err: any) => {
    console.log(`An error occurred: ${err.message}`);
    process.exit(1);
});
