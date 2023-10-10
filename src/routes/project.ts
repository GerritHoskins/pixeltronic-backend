import express from 'express';
import { add, all, get, remove, update } from '../project/project';
import { upload } from '../storage';

const router = express.Router();
router.route('/get').get(get);
router.route('/all').get(all);

//TODO: requires auth
router.route('/add').post(add, upload.single('file'), (req, res) => {
  console.log(req.file);
  return res.status(200).send('Single file');
});
router.route('/update').put(update);
router.route('/remove').delete(remove);

export default router;
