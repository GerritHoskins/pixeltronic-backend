import express from 'express';
import { add, all, get, remove, update } from '../project/project';

const router = express.Router();
router.route('/get').get(get);
router.route('/all').get(all);

//TODO: requires auth
router.route('/add').post(add);
router.route('/update').put(update);
router.route('/remove').delete(remove);

export default router;
