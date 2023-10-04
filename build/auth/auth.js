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
exports.getUsers = exports.userAuth = exports.adminAuth = exports.deleteUser = exports.update = exports.login = exports.register = void 0;
// @ts-ignore
const bcryptjs_1 = require("bcryptjs");
// @ts-ignore
const jsonwebtoken_1 = require("jsonwebtoken");
const util_1 = require("util");
const user_1 = __importDefault(require("../model/user"));
const verifyPromise = (0, util_1.promisify)(jsonwebtoken_1.verify);
const jwtSecretLive = 'a5cf0ede0437f64632e9cf42ff95b6c7a4cd07bac2128280c6e654be186d6e9ba51dd3';
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (password && password.length < 6) {
        return res.status(400).json({ message: 'Password less than 6 characters' });
    }
    try {
        (0, bcryptjs_1.hash)(password, 10).then((hash) => __awaiter(void 0, void 0, void 0, function* () {
            yield user_1.default.create({
                username,
                password: hash,
            })
                .then((user) => {
                const maxAge = 3 * 60 * 60;
                const token = (0, jsonwebtoken_1.sign)({ id: user._id, username, role: user.role }, jwtSecretLive, {
                    expiresIn: maxAge, // 3hrs in sec
                });
                res.cookie('jwt', token, {
                    httpOnly: true,
                    maxAge: maxAge * 1000, // 3hrs in ms
                });
                res.status(201).json({
                    message: 'User successfully created',
                    user: user._id,
                });
            })
                .catch((error) => res.status(400).json({
                message: 'User not successful created',
                error: error.message,
            }));
        }));
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'User creation failed' });
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username or Password not provided' });
    }
    try {
        yield user_1.default.findOne({ username }).then((user) => {
            (0, bcryptjs_1.compare)(password, user === null || user === void 0 ? void 0 : user.password).then((result) => {
                if (result) {
                    const maxAge = 3 * 60 * 60;
                    const token = (0, jsonwebtoken_1.sign)({ id: user === null || user === void 0 ? void 0 : user._id, username, role: user === null || user === void 0 ? void 0 : user.role }, jwtSecretLive, {
                        expiresIn: maxAge, // 3hrs in sec
                    });
                    res.cookie("jwt", token, {
                        httpOnly: true,
                        maxAge: maxAge * 1000, // 3hrs in ms
                    });
                    res.status(201).json({
                        message: "User successfully Logged in",
                        user: user === null || user === void 0 ? void 0 : user._id,
                    });
                }
                else {
                    res.status(400).json({ message: "Login not succesful" });
                }
            });
        });
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Login failed' });
    }
});
exports.login = login;
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, id } = req.body;
    if (!role || !id) {
        return res.status(400).json({ message: 'Role or Id not provided' });
    }
    try {
        const user = yield user_1.default.findById(id);
        if (!user || user.role === role) {
            return res.status(400).json({ message: `User not found or already has role: ${role}` });
        }
        user.role = role;
        yield user.save();
        return res.status(200).json({ message: 'Update successful', user });
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Update failed' });
    }
});
exports.update = update;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    try {
        const user = yield user_1.default.findById(id);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        yield user.deleteOne();
        return res.status(200).json({ message: 'User successfully deleted' });
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Delete failed' });
    }
});
exports.deleteUser = deleteUser;
const auth = (role) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "Not authorized, token not available" });
        }
        const decodedToken = yield verifyPromise(token, jwtSecretLive);
        if (decodedToken.role !== role) {
            return res.status(401).json({ message: "Not authorized" });
        }
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Not authorized" });
    }
});
exports.adminAuth = auth('admin');
exports.userAuth = auth('Basic');
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find({});
        const userFunction = users.map(user => ({
            username: user.username,
            role: user.role
        }));
        res.status(200).json({ user: userFunction });
    }
    catch (err) {
        res.status(401).json({ message: "Not successful" });
    }
});
exports.getUsers = getUsers;
