import express from 'express';
import { getUsers, test } from '../controllers/user.controller.js';
import { signout } from '../controllers/user.controller.js';
import { deleteUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyuser.js';
const router = express.Router();

router.get('/test', test );
router.post('/signout', signout);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.get ('/getusers', verifyToken, getUsers);





  export default router;