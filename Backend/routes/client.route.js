import express from 'express';
import {
  createclient,
  deleteclient,
  updateclient,
  getclient,
  getallclients,
} from '../controllers/client.controller.js';
import { verifyToken } from '../utils/verifyuser.js';
import upload from '../middleware/multer.js';

const router = express.Router();


router.post('/create', verifyToken, upload.single('client_image'), createclient);
router.post('/update/:id', verifyToken, upload.single('client_image'), updateclient);
router.delete('/deleteclient/:id', verifyToken, deleteclient);
router.get('/getclient', getclient);
router.get('/getallclients/:id', getallclients);

export default router;
