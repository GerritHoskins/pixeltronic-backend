import express from 'express';
import { add, get, getAll, remove, update } from '../project/project';

const router = express.Router();
router.route('/get').get(get);
router.route('/all').get(getAll);

//TODO: requires auth
router.route('/add').post(add);
router.route('/update').put(update);
router.route('/delete').delete(remove);

export default router;
