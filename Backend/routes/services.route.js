import express from 'express';
import { createservice, deleteservice, getallservices, getservice, updateservice } from '../controllers/services.controller.js';
import { verifyToken } from '../utils/verifyuser.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.post('/create', verifyToken, upload.single('s_link'), createservice);
router.delete('/deleteservice/:id', verifyToken,  deleteservice);
router.post('/update/:id', verifyToken,upload.single('s_link'), updateservice);
router.get('/getservice', getservice);
router.get('/getallservices/:id', getallservices);

export default router;