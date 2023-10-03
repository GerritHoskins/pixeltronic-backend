import express from 'express';
import connectDB from './db';
import router from './auth/route';

const app = express();
const PORT = 3000;

const server = app.listen(PORT, async() => {
    console.log(`Server Connected to port ${PORT}`);
    await connectDB();
})

app.get('/', (req, res) => {
    res.send('Server up and running.');
})

process.on('unhandledRejection', (err: { message: string }) => {
    console.log(`An error occurred: ${err.message}`);
    server.close(() => process.exit(1));
})

app.use(express.json());
app.use('/api/auth', router);