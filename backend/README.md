# Image Processor Backend

A TypeScript/Node.js backend for processing images with background removal and horizontal flipping.

## Features

- Image upload with multer
- Background removal (placeholder implementation)
- Horizontal image flipping
- Image metadata storage
- RESTful API endpoints
- Static file serving for processed images

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
PORT=5001
NODE_ENV=development
```

3. Build the project:
```bash
npm run build
```

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

- `POST /api/images/upload` - Upload and process an image
- `GET /api/images` - Get all processed images
- `GET /api/images/:id` - Get a specific image by ID
- `DELETE /api/images/:id` - Delete an image

## Background Removal Integration

Currently, this is a placeholder implementation. To integrate with a real background removal service:

1. Sign up for a service like Remove.bg, Cloudinary, or Replicate
2. Add your API key to the `.env` file
3. Update the `ImageService.processImage()` method to call the actual API

## File Structure

```
src/
├── controllers/     # Request handlers
├── services/        # Business logic
├── routes/          # API route definitions
└── index.ts         # Main server file
```

## Development

- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
