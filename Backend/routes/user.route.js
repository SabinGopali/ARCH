import express from 'express';
import { getUserById, getUsers, loginUser, test } from '../controllers/user.controller.js';
import { signout } from '../controllers/user.controller.js';
import { deleteUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyuser.js';
const router = express.Router();


router.post('/login', loginUser);
router.get('/test', test );
router.post('/signout', signout);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.get ('/getusers', verifyToken, getUsers);
router.get('/user/:id', verifyToken, getUserById);

  export default router;