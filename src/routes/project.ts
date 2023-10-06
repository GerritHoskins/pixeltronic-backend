import express from 'express';
import { add, get, getAll, remove, update } from '../project/project';
import { adminAuth } from '../auth/auth';

const router = express.Router();
router.route('/getProject').get(get);
router.route('/getProjects').get(getAll);

//requires auth
router.route('/addProject').post(add);

router.route('/updateProject').put(adminAuth, update);
router.route('/removeProject').delete(adminAuth, remove);

export default router;
