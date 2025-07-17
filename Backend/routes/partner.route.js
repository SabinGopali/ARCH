import express from 'express';
import { createpartner, deletepartner, getallpartners, getpartner, updatepartner } from '../controllers/partner.controller.js';
import { verifyToken } from '../utils/verifyuser.js';

const router = express.Router();

router.post('/create', verifyToken, createpartner);
router.delete('/deletePartner/:id', verifyToken, deletepartner);
router.post('/update/:id', verifyToken, updatepartner);
router.get('/getPartner', getpartner);
router.get('/getallPartners/:id', getallpartners);

// router.get('/getAll', getAdminCareers);

export default router;