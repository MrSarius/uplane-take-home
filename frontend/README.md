# Image Processor Frontend

A React TypeScript frontend for the image processing application.

## Features

- Modern, responsive UI with glassmorphism design
- Drag and drop image upload
- Image preview before processing
- Gallery view of processed images
- Image deletion functionality
- Real-time updates

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Development

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Backend Integration

This frontend expects the backend to be running on `http://localhost:5001`. Make sure the backend server is running before using the frontend.

## Technologies Used

- React 18
- TypeScript
- CSS3 with modern features
- Fetch API for HTTP requests

## Component Structure

- `App.tsx` - Main application component
- `ImageUpload.tsx` - Image upload component with drag & drop
- `ImageGallery.tsx` - Gallery display of processed images
- `types.ts` - TypeScript type definitions
