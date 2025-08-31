import { Request, Response } from 'express';
import { ImageService } from '../services/ImageService';
import { v4 as uuidv4 } from 'uuid';

export class ImageController {
  private imageService: ImageService;

  constructor() {
    this.imageService = new ImageService();
  }

  uploadAndProcess = async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
      }

      const imageId = uuidv4();
      const originalName = req.file.originalname;
      
      const processedImageUrl = await this.imageService.processImage(
        req.file.buffer,
        imageId,
        originalName
      );

      const imageData = {
        id: imageId,
        originalName,
        processedUrl: processedImageUrl,
        uploadedAt: new Date().toISOString(),
      };

      await this.imageService.saveImageMetadata(imageData);

      res.status(201).json({
        message: 'Image processed successfully',
        image: imageData
      });

    } catch (error) {
      console.error('Error processing image:', error);
      res.status(500).json({ 
        error: 'Failed to process image',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  getAllImages = async (req: Request, res: Response) => {
    try {
      const images = await this.imageService.getAllImages();
      res.json(images);
    } catch (error) {
      console.error('Error fetching images:', error);
      res.status(500).json({ error: 'Failed to fetch images' });
    }
  };

  getImageById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const image = await this.imageService.getImageById(id);
      
      if (!image) {
        return res.status(404).json({ error: 'Image not found' });
      }

      res.json(image);
    } catch (error) {
      console.error('Error fetching image:', error);
      res.status(500).json({ error: 'Failed to fetch image' });
    }
  };

  deleteImage = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.imageService.deleteImage(id);
      
      res.json({ message: 'Image deleted successfully' });
    } catch (error) {
      console.error('Error deleting image:', error);
      res.status(500).json({ error: 'Failed to delete image' });
    }
  };
}
