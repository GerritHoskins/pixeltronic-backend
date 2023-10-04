"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("./auth");
const router = express_1.default.Router();
router.route("/register").post(auth_1.register);
router.route("/login").post(auth_1.login);
router.route("/getUsers").get(auth_1.getUsers);
// updating user roles and deleting users should be done by an Admin
router.route("/update").put(auth_1.adminAuth, auth_1.update);
router.route("/deleteUser").delete(auth_1.adminAuth, auth_1.deleteUser);
exports.default = router;
