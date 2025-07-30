import multer from "multer";
import path from "path";
import fs from "fs";

// Root upload directory
const rootUploadDir = "uploads";

// Ensure root folder exists
if (!fs.existsSync(rootUploadDir)) {
  fs.mkdirSync(rootUploadDir);
}

// Multer disk storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let subfolder = "others"; // default fallback

    // Define folders based on field name
    switch (file.fieldname) {
      case "images":
        subfolder = "products";
        break;
      case "variantImages":
        subfolder = "variants";
        break;
      case "profile":
        subfolder = "profiles";
        break;
    }

    const finalPath = path.join(rootUploadDir, subfolder);

    // Ensure subfolder exists
    if (!fs.existsSync(finalPath)) {
      fs.mkdirSync(finalPath, { recursive: true });
    }

    cb(null, finalPath);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname); // e.g. 1720453748710.jpg
    cb(null, uniqueSuffix);
  },
});

// File filter for images and videos
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif|mp4|mov|avi|mkv|webm/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype.toLowerCase());

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only image and video files are allowed (jpeg, jpg, png, webp, gif, mp4, mov, avi, mkv, webm)"
      )
    );
  }
};

// Configure multer with increased limit for videos
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max size
  fileFilter,
});

export default upload;
