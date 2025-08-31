import express from 'express';
import multer from 'multer';
import { ImageController } from '../controllers/ImageController';

const router = express.Router();
const imageController = new ImageController();

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

router.post('/upload', upload.single('image'), imageController.uploadAndProcess);

router.get('/', imageController.getAllImages);

router.get('/:id', imageController.getImageById);

router.delete('/:id', imageController.deleteImage);

export { router as imageRoutes };
