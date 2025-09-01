import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import FormData from 'form-data';

export interface ImageMetadata {
  id: string;
  originalName: string;
  processedUrl: string;
  uploadedAt: string;
}

export class ImageService {
  private uploadsDir: string;
  private processedDir: string;
  private metadataFile: string;
  private removeBgApiKey: string;

  constructor() {
    this.uploadsDir = path.join(__dirname, '../../uploads');
    this.processedDir = path.join(__dirname, '../../processed');
    this.metadataFile = path.join(__dirname, '../../data/images.json');
    this.removeBgApiKey = process.env.REMOVE_BG_API_KEY || '';
    
    this.ensureDirectories();
  }

  private ensureDirectories(): void {
    [this.uploadsDir, this.processedDir, path.dirname(this.metadataFile)].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    if (!fs.existsSync(this.metadataFile)) {
      fs.writeFileSync(this.metadataFile, JSON.stringify([], null, 2));
    }
  }

  async processImage(imageBuffer: Buffer, imageId: string, originalName: string): Promise<string> {
    try {
      const originalPath = path.join(this.uploadsDir, `${imageId}_original.jpg`);
      await sharp(imageBuffer).jpeg().toFile(originalPath);

      const processedBuffer = await this.removeBackgroundAndFlip(imageBuffer);
      
      const processedPath = path.join(this.processedDir, `${imageId}_processed.png`);
      await sharp(processedBuffer).toFile(processedPath);

      return `/processed/${imageId}_processed.png`;

    } catch (error) {
      console.error('Error processing image:', error);
      throw new Error('Failed to process image');
    }
  }

  private async removeBackgroundAndFlip(imageBuffer: Buffer): Promise<Buffer> {
    try {
      let processedBuffer: Buffer;

      if (this.removeBgApiKey) {
        try {
          const backgroundRemovedBuffer = await this.callRemoveBgAPI(imageBuffer);
          
          processedBuffer = await sharp(backgroundRemovedBuffer)
            .flop() 
            .png()
            .toBuffer();
          
          console.log('Successfully processed image with Remove.bg API');
        } catch (apiError) {
          console.warn('Remove.bg API failed, falling back to basic processing:', apiError);
          processedBuffer = await this.basicImageProcessing(imageBuffer);
        }
      } else {
        console.log('No Remove.bg API key found, using basic processing');
        processedBuffer = await this.basicImageProcessing(imageBuffer);
      }
      
      return processedBuffer;
    } catch (error) {
      console.error('Error in image processing:', error);
      throw new Error('Failed to process image');
    }
  }

  private async callRemoveBgAPI(imageBuffer: Buffer): Promise<Buffer> {
    try {
      if (imageBuffer.length > 12 * 1024 * 1024) { // 12MB limit
        throw new Error('Image is too large. Remove.bg API supports images up to 12MB.');
      }
      
      if (!imageBuffer || imageBuffer.length === 0) {
        throw new Error('Invalid image buffer provided.');
      }
      
      const form = new FormData();
      form.append('image_file', imageBuffer, {
        filename: 'image.jpg',
        contentType: 'image/jpeg'
      });
      
      const response = await axios.post('https://api.remove.bg/v1.0/removebg', form, {
        headers: {
          'X-Api-Key': this.removeBgApiKey,
          ...form.getHeaders(),
        },
        responseType: 'arraybuffer',
        timeout: 30000, // 30 second timeout
      });

      if (response.status === 200) {
        return Buffer.from(response.data as ArrayBuffer);
      } else {
        throw new Error(`Remove.bg API returned status ${response.status}`);
      }
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.log('Remove.bg API Error Details:');
        console.log('Status:', axiosError.response?.status);
        console.log('Status Text:', axiosError.response?.statusText);
        console.log('Response Headers:', axiosError.response?.headers);
        if (axiosError.response?.data) {
          console.log('Response Data:', axiosError.response.data);
        }
        
        if (axiosError.response?.status === 402) {
          throw new Error('Remove.bg API quota exceeded. Please upgrade your plan or wait until next month.');
        } else if (axiosError.response?.status === 401) {
          throw new Error('Invalid Remove.bg API key. Please check your configuration.');
        } else if (axiosError.response?.status === 429) {
          throw new Error('Remove.bg API rate limit exceeded. Please try again later.');
        } else {
          throw new Error(`Remove.bg API error: ${axiosError.response?.status} - ${axiosError.response?.statusText}`);
        }
      }
      throw new Error(`Remove.bg API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async basicImageProcessing(imageBuffer: Buffer): Promise<Buffer> {
    return await sharp(imageBuffer)
      .flop()
      .png()
      .toBuffer();
  }

  async saveImageMetadata(imageData: ImageMetadata): Promise<void> {
    try {
      const images = this.loadImageMetadata();
      images.push(imageData);
      fs.writeFileSync(this.metadataFile, JSON.stringify(images, null, 2));
    } catch (error) {
      console.error('Error saving image metadata:', error);
      throw new Error('Failed to save image metadata');
    }
  }

  async getAllImages(): Promise<ImageMetadata[]> {
    try {
      return this.loadImageMetadata();
    } catch (error) {
      console.error('Error loading image metadata:', error);
      throw new Error('Failed to load image metadata');
    }
  }

  async getImageById(id: string): Promise<ImageMetadata | null> {
    try {
      const images = this.loadImageMetadata();
      return images.find(img => img.id === id) || null;
    } catch (error) {
      console.error('Error loading image metadata:', error);
      throw new Error('Failed to load image metadata');
    }
  }

  async deleteImage(id: string): Promise<void> {
    try {
      const images = this.loadImageMetadata();
      const imageIndex = images.findIndex(img => img.id === id);
      
      if (imageIndex === -1) {
        throw new Error('Image not found');
      }

      const image = images[imageIndex];
      
      const originalPath = path.join(this.uploadsDir, `${id}_original.jpg`);
      const processedPath = path.join(this.processedDir, `${id}_processed.png`);
      
      [originalPath, processedPath].forEach(filePath => {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });

      images.splice(imageIndex, 1);
      fs.writeFileSync(this.metadataFile, JSON.stringify(images, null, 2));

    } catch (error) {
      console.error('Error deleting image:', error);
      throw new Error('Failed to delete image');
    }
  }

  private loadImageMetadata(): ImageMetadata[] {
    try {
      const data = fs.readFileSync(this.metadataFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading metadata file:', error);
      return [];
    }
  }
}