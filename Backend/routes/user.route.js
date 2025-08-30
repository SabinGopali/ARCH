import express from 'express';
import { verifyToken } from '../utils/verifyuser.js';

// Import controller functions
import {
  loginUser,
  test,
  signout,
  deleteUser,
  getUsers,
  getUserById,
  getCurrentUser,
  getUserProduct,
  getSupplierUsers,
  requestUserDeletion,
  adminDeleteUser,
  adminRejectDeletion
} from '../controllers/user.controller.js';

const router = express.Router();

// ✅ Correct route patterns
router.post('/login', loginUser);
router.get('/test', test);
router.post('/signout', signout);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.get('/getusers', verifyToken, getUsers);
router.get('/user/:id', verifyToken, getUserById);
router.get('/me', verifyToken, getCurrentUser);
router.get('/product/:id', verifyToken, getUserProduct);
router.get('/supplier-users', verifyToken, getSupplierUsers);
router.post("/request-deletion/:userId", verifyToken, requestUserDeletion);
router.delete("/admin-delete/:userId", verifyToken, adminDeleteUser);
router.post("/admin-reject-deletion/:userId", verifyToken, adminRejectDeletion);

export default router;