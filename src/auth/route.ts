import express from 'express';
import {adminAuth, deleteUser, getUsers, login, register, update} from './auth';

const router = express.Router();

router.route("/register").post(register)
router.route("/login").post(login);
router.route("/getUsers").get(getUsers);

// updating user roles and deleting users should be done by an Admin
router.route("/update").put(adminAuth, update)
router.route("/deleteUser").delete(adminAuth, deleteUser)

export default router;