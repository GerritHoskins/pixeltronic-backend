"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// @ts-ignore
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = __importDefault(require("./db"));
const route_1 = __importDefault(require("./auth/route"));
const auth_1 = require("./auth/auth");
const app = (0, express_1.default)();
const PORT = 3000;
// Middleware
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Routes
app.get('/', (req, res) => {
    console.log('Server up and running.');
    res.send('Server up and running.');
});
app.get('/admin', auth_1.adminAuth, (req, res) => res.send('Admin Route'));
app.get('/basic', auth_1.userAuth, (req, res) => res.send('User Route'));
app.get('/logout', (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
});
app.use('/api/auth', route_1.default);
// Error Handler Middleware (placed after all other routes and middleware)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).send('Something broke!');
});
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.default)();
        app.listen(PORT, () => {
            console.log(`Server connected to port ${PORT}`);
        });
    }
    catch (error) {
        console.error(`Error connecting to database: ${error}`);
        process.exit(1);
    }
});
startServer();
process.on('unhandledRejection', (err) => {
    console.log(`An error occurred: ${err.message}`);
    process.exit(1);
});
