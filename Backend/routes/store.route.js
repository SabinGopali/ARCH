import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { verifyToken } from '../utils/verifyuser.js';
import { 
  getStoreProfile, 
  createOrUpdateStoreProfile, 
  deleteStoreProfile,
  getAllStoreProfiles,
  deleteStoreProfileByUserId
} from '../controllers/store.controller.js';

const router = express.Router();

// Ensure upload folder exists
const uploadFolder = 'uploads/store';
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Routes
router.get('/get/:id', verifyToken, getStoreProfile);
router.post('/create', 
  verifyToken,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "bgImage", maxCount: 1 },
  ]),
  createOrUpdateStoreProfile
);
router.delete('/store-profile', verifyToken, deleteStoreProfile);

// Admin routes
router.get('/admin/all', verifyToken, getAllStoreProfiles);
router.delete('/admin/delete/:userId', verifyToken, deleteStoreProfileByUserId);

export default router;