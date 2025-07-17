import express from 'express';
import {
  createteam,
  deleteteam,
  updateteam,
  getteam,
  getallteams,
} from '../controllers/team.controller.js';
import { verifyToken } from '../utils/verifyuser.js';
import upload from '../middleware/multer.js';

const router = express.Router();


router.post('/create', verifyToken, upload.single('t_image'), createteam);
router.post('/update/:id', verifyToken, upload.single('t_image'), updateteam);
router.delete('/deleteteam/:id', verifyToken, deleteteam);
router.get('/getteam', getteam);
router.get('/getallteams/:id', getallteams);

export default router;
