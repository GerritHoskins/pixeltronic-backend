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
exports.deleteUser = exports.update = exports.login = exports.register = void 0;
// @ts-ignore
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = __importDefault(require("../model/user"));
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (password.length < 6) {
        return res.status(400).json({ message: "Password less than 6 characters" });
    }
    try {
        bcryptjs_1.default.hash(password, 10).then((hash) => __awaiter(void 0, void 0, void 0, function* () {
            yield user_1.default.create({
                username,
                password: hash,
            })
                .then((user) => res.status(200).json({
                message: "User successfully created",
                user,
            }))
                .catch((error) => res.status(400).json({
                message: "User not successful created",
                error: error.message,
            }));
        }));
    }
    catch (err) {
        res.status(401).json({
            message: "User not successful created",
            error: err.mesage,
        });
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    // Check if username and password is provided
    if (!username || !password) {
        return res.status(400).json({
            message: "Username or Password not present",
        });
    }
    try {
        const user = yield user_1.default.findOne({ username });
        if (!user) {
            res.status(400).json({
                message: "Login not successful",
                error: "User not found",
            });
        }
        else {
            // comparing given password with hashed password
            bcryptjs_1.default.compare(password, user.password).then(function (result) {
                result
                    ? res.status(200).json({
                        message: "Login successful",
                        user,
                    })
                    : res.status(400).json({ message: "Login not succesful" });
            });
        }
    }
    catch (error) {
        res.status(400).json({
            message: "An error occurred",
            error: error === null || error === void 0 ? void 0 : error.message,
        });
    }
});
exports.login = login;
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, id } = req.body;
    if (role && id) {
        yield user_1.default.findById(id)
            .then((user) => {
            if (!user) {
                throw Error;
            }
            if ((user === null || user === void 0 ? void 0 : user.role) !== role) {
                user.role = role;
                user.save()
                    .then(() => {
                    res.status(201).json({ message: "Update successful", user });
                })
                    .catch((err) => {
                    res.status(400).json({ message: "An error occurred", error: err.message });
                    process.exit(1);
                });
            }
            else {
                res.status(400).json({ message: "User already has role: " + role });
            }
        })
            .catch((error) => {
            res
                .status(400)
                .json({ message: "An error occurred", error: error.message });
        });
    }
    else {
        res.status(400).json({ message: "Role or Id not present" });
    }
});
exports.update = update;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    yield user_1.default.findById(id)
        .then(user => user === null || user === void 0 ? void 0 : user.deleteOne())
        .catch(error => res
        .status(400)
        .json({ message: "An error occurred", error: error.message }))
        .then(user => res.status(201).json({ message: "User successfully deleted", user }))
        .catch(error => res
        .status(400)
        .json({ message: "An error occurred", error: error.message }));
});
exports.deleteUser = deleteUser;
