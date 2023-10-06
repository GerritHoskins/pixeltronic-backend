import express from 'express';
import { add, get, getAll, remove, update } from '../project/project';

const router = express.Router();
router.route('/getProject').get(get);
router.route('/getProjects').get(getAll);

//TODO: requires auth
router.route('/addProject').post(add);
router.route('/updateProject').put(update);
router.route('/removeProject').delete(remove);

export default router;
