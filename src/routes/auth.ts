import express from 'express';
import { adminAuth, all, login, register, remove, update } from '../auth/auth';

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/all').get(all);

// updating user roles and deleting users should be done by an Admin
router.route('/update').put(adminAuth, update);
router.route('/delete').delete(adminAuth, remove);

export default router;
