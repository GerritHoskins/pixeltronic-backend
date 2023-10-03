import express, {Express, NextFunction, Request, Response} from 'express';
import connectDB from './db';
import router from './auth/route';

const app: Express = express();
const PORT: number | string = 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
    console.log('Server up and running.');
    res.send('Server up and running.');
});

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
