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
const db_1 = __importDefault(require("./db"));
const route_1 = __importDefault(require("./auth/route"));
const app = (0, express_1.default)();
const PORT = 3000;
const server = app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Server Connected to port ${PORT}`);
    yield (0, db_1.default)();
}));
app.get('/', (req, res) => {
    res.send('Server up and running.');
});
process.on('unhandledRejection', (err) => {
    console.log(`An error occurred: ${err.message}`);
    server.close(() => process.exit(1));
});
app.use(express_1.default.json());
app.use('/api/auth', route_1.default);
