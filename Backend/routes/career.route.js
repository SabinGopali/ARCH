import express from 'express';
import { createCareer, deleteCareer, updateCareer, getCareer, getCareers } from '../controllers/career.controller.js';
import { verifyToken } from '../utils/verifyuser.js';

const router = express.Router();

router.post('/create', verifyToken, createCareer);
router.delete('/deleteCareer/:id', verifyToken, deleteCareer);
router.post('/update/:id', verifyToken, updateCareer);
router.get('/getCareer', getCareer);
router.get('/getCareers/:id', getCareers);

// router.get('/getAll', getAdminCareers);

export default router;