import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { imageRoutes } from './routes/imageRoutes';

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration for production deployment
const corsOptions = {
  origin: [
    'http://localhost:3000', // Development frontend
    'https://*.vercel.app',  // Vercel preview deployments
    'https://*.vercel.app',  // Vercel production deployments
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/processed', express.static(path.join(__dirname, '../processed')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/images', imageRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Image Processor API is running' });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Processed images available at: http://localhost:${PORT}/processed/`);
});
