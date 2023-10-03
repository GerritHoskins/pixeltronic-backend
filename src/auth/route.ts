import express from 'express';
import { deleteUser, login, register, update } from './auth';

const router = express.Router();

router.route("/register").post(register)
router.route("/login").post(login);
router.route("/update").put(update);
router.route("/deleteUser").delete(deleteUser);

export default router;