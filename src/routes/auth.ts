import express from 'express';
import { adminAuth, deleteUser, getUsers, login, register, update } from '../auth/auth';

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/all').get(getUsers);

// updating user roles and deleting users should be done by an Admin
router.route('/update').put(adminAuth, update);
router.route('/delete').delete(adminAuth, deleteUser);

export default router;
