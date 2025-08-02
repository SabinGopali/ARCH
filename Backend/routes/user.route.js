import express from 'express';
import { adminDeleteUser, adminRejectDeletion, getCurrentUser, getSupplierUsers, getUserById, getUserProduct, getUsers, loginUser, requestUserDeletion, test } from '../controllers/user.controller.js';
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
router.get('/me', verifyToken, getCurrentUser);
router.get('/product/:id', verifyToken, getUserProduct)
router.get('/supplier-users', verifyToken, getSupplierUsers);
router.post("/request-deletion/:userId", verifyToken, requestUserDeletion);

// Admin approves and deletes
router.delete("/admin-delete/:userId", verifyToken, adminDeleteUser);
router.post("/admin-reject-deletion/:userId", verifyToken, adminRejectDeletion);




  export default router;