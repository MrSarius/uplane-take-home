# 🚀 Complete Vercel Deployment Guide for Image Processor

## ✅ Code Changes Completed

All necessary code changes have been made to prepare your project for Vercel deployment:

### Frontend Changes Made:
1. **App.tsx** - Updated `fetchImages` function to use environment variables
2. **ImageUpload.tsx** - Updated `handleUpload` function to use environment variables  
3. **ImageGallery.tsx** - Updated all API calls and image URLs to use environment variables
4. **vercel.json** - Created Vercel configuration file

### Backend Changes Made:
1. **index.ts** - Updated CORS configuration to allow Vercel domains

## 🌐 Step-by-Step Deployment Process

### Step 1: Deploy Backend First

Since your frontend depends on the backend API, deploy the backend first:

#### Option A: Deploy to Railway (Recommended)
1. Go to [Railway](https://railway.app) and sign in with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Configure the deployment:
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: `/` (leave as default)
5. Add environment variables:
   - `PORT=5001`
   - `NODE_ENV=production`
   - `REMOVE_BG_API_KEY=your_api_key_here` (or your chosen image processing API)
6. Deploy and note the generated URL (e.g., `https://your-app-name.railway.app`)

#### Option B: Deploy to Render
1. Go to [Render](https://render.com) and sign in
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `image-processor-backend`
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
5. Add environment variables as above
6. Deploy and note the URL

### Step 2: Deploy Frontend to Vercel

1. **Go to [Vercel](https://vercel.com)** and sign in with GitHub
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure the project settings**:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `build` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

5. **Set Environment Variables**:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://your-backend-url.com` (use your actual backend URL from Step 1)
   - **Environment**: Production, Preview, Development

6. **Click "Deploy"**
7. **Wait for the build to complete**
8. Your app will be available at `https://your-app-name.vercel.app`

### Step 3: Update Backend CORS with Vercel Domain

After your frontend is deployed, update your backend CORS configuration with the actual Vercel domain:

1. **Get your Vercel domain** from the deployment
2. **Update `backend/src/index.ts`**:

```typescript
const corsOptions = {
  origin: [
    'http://localhost:3000', // Development frontend
    'https://*.vercel.app',  // Vercel preview deployments
    'https://your-app-name.vercel.app', // Your actual Vercel domain
    // Add your custom domain here if you have one
    // 'https://your-custom-domain.com'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
```

3. **Redeploy your backend** with the updated CORS configuration

### Step 4: Create Frontend Environment File

Create a `.env` file in the `frontend/` directory:

```env
REACT_APP_API_URL=https://your-backend-url.com
```

**Important**: Replace `https://your-backend-url.com` with your actual backend deployment URL from Step 1.

## 🔧 Environment Variables Reference

### Frontend (.env file in frontend/ directory)
```env
REACT_APP_API_URL=https://your-backend-url.com
```

### Backend (set in deployment platform)
```env
PORT=5001
NODE_ENV=production
REMOVE_BG_API_KEY=your_api_key_here
# or
CLOUDINARY_URL=your_cloudinary_url_here
# or
REPLICATE_API_TOKEN=your_token_here
```

## 🧪 Testing Your Deployment

1. **Frontend**: Visit your Vercel URL and test the UI
2. **Image Upload**: Try uploading an image to test the backend connection
3. **Image Processing**: Verify background removal and flipping work
4. **Gallery**: Check if processed images display correctly

## 🚨 Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Ensure Node.js version compatibility (add `.nvmrc` file if needed)
   - Check all dependencies are in `package.json`

2. **API Connection Issues**:
   - Verify `REACT_APP_API_URL` environment variable is set correctly
   - Check backend CORS configuration includes Vercel domain
   - Ensure backend is accessible and responding

3. **Image Processing Issues**:
   - Verify background removal API keys are set in backend
   - Check if backend can handle file uploads in production

### Debug Commands:

```bash
# Check backend logs
railway logs
# or
render logs

# Check frontend build locally
cd frontend && npm run build

# Check backend build locally
cd backend && npm run build
```

## 🔄 Continuous Deployment

- Vercel automatically redeploys on GitHub pushes
- Set up branch deployments for testing
- Use preview deployments for feature branches

## 🎯 Performance Optimization

### Frontend:
- Vercel automatically optimizes images
- Use lazy loading for images
- Implement proper caching strategies

### Backend:
- Add response caching headers
- Implement rate limiting
- Use CDN for static assets

## 🔒 Security Considerations

- HTTPS is automatic with Vercel
- Proper CORS policies implemented
- API key validation on backend
- Rate limiting recommended

## ✅ Final Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] CORS properly configured
- [ ] Image processing APIs configured
- [ ] All functionality tested
- [ ] Performance monitoring enabled

## 🎉 You're Ready to Deploy!

Your Image Processor application is now fully prepared for Vercel deployment. The frontend will communicate with your backend API to process images, remove backgrounds, and flip them horizontally.

**Next Steps:**
1. Deploy your backend to Railway/Render
2. Deploy your frontend to Vercel
3. Update the backend CORS with your Vercel domain
4. Test all functionality
5. Enjoy your deployed application! 🚀
