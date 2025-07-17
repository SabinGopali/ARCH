import express from 'express';
import { createform } from '../controllers/form.controller.js';
import { verifyToken } from '../utils/verifyuser.js';
import { deleteform } from '../controllers/form.controller.js';
import { updateform } from '../controllers/form.controller.js';
import { getform } from '../controllers/form.controller.js';
import { getallforms } from '../controllers/form.controller.js';
import { viewform } from '../controllers/form.controller.js';

const router = express.Router();

router.post('/create', verifyToken, createform);
router.delete('/deleteform/:id', verifyToken, deleteform);
router.post('/update/:id', verifyToken, updateform);
router.get('/getform', getform);
router.get('/getallforms/:id', getallforms);
router.get('/viewform/:id', viewform);

// router.get('/getAll', getAdminCareers);

export default router;