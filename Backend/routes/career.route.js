import express from 'express';
import { createCareer, deleteCareer, updateCareer, getCareer } from '../controllers/career.controller.js';
import { verifyToken } from '../utils/verifyuser.js';

const router = express.Router();

router.post('/create', verifyToken, createCareer);
router.delete('/delete/:id', verifyToken, deleteCareer);
router.post('/update/:id', verifyToken, updateCareer);
router.get('/getCareer', getCareer);
// router.get('/getAll', getAdminCareers);

export default router;