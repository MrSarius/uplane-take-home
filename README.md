# Image Processor - Full Stack Application

A full-stack application that allows users to upload images, process them through background removal and horizontal flipping, and manage the resulting images.

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 16+ 
- npm or yarn

### 1. Clone and Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Start the Backend

```bash
cd backend

# Development mode
npm run dev

# Or build and start production
npm run build
npm start
```

The backend will run on `http://localhost:5001`

### 3. Start the Frontend

```bash
cd frontend

# Development mode
npm start
```

The frontend will run on `http://localhost:3000`

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5001
NODE_ENV=development
```

### Background Removal Service Integration

Currently, the background removal is a placeholder. To integrate with real services:

1. **Remove.bg** (Recommended for free tier):
   - Sign up at [remove.bg](https://remove.bg/api)
   - Get free API credits
   - Add `REMOVE_BG_API_KEY=your_key` to `.env`

2. **Cloudinary**:
   - Sign up at [cloudinary.com](https://cloudinary.com)
   - Get free credits
   - Add `CLOUDINARY_URL=your_url` to `.env`

3. **Replicate**:
   - Sign up at [replicate.com](https://replicate.com)
   - Get free credits
   - Add `REPLICATE_API_TOKEN=your_token` to `.env`

## 📡 API Endpoints

- `POST /api/images/upload` - Upload and process image
- `GET /api/images` - Get all processed images
- `GET /api/images/:id` - Get specific image
- `DELETE /api/images/:id` - Delete image
- `GET /health` - Health check

## 🚀 Deployment

### Frontend (Vercel - Recommended)

```bash
cd frontend
npm run build
# Deploy build folder to Vercel
```

### Backend (Railway/Render)

```bash
cd backend
npm run build
# Deploy dist folder to Railway or Render
```

### Environment Variables for Production

Set the following in your deployment platform:
- `PORT` - Server port
- `NODE_ENV=production`
- Background removal API keys

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 🔍 Troubleshooting

### Common Issues

1. **Backend won't start**: Check if port 5000 is available
2. **Frontend can't connect**: Ensure backend is running on port 5000
3. **Image upload fails**: Check file size (max 10MB) and format
4. **Background removal not working**: Integrate with a real API service

### Development Tips

- Use `npm run dev` in backend for auto-reload
- Frontend auto-reloads with `npm start`
- Check browser console for frontend errors
- Check terminal for backend errors

## 📝 TODO for Production

- [ ] Integrate real background removal API
- [ ] Add image hosting service (Cloudinary/AWS S3)
- [ ] Implement user authentication
- [ ] Add rate limiting
- [ ] Set up proper error logging
- [ ] Add image compression
- [ ] Implement caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check browser console and terminal logs
4. Create an issue in the repository

---

**Note**: This is a take-home project demonstrating full-stack development skills. The background removal is currently a placeholder and needs integration with a real service for production use.
