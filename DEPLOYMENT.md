# Deployment Guide

This guide will help you deploy the Image Processor application to production.

## 🚀 Quick Deploy Options

### Option 1: Vercel + Railway (Recommended)

**Frontend (Vercel):**
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Set build command: `cd frontend && npm run build`
4. Set output directory: `frontend/build`
5. Deploy

**Backend (Railway):**
1. Push your code to GitHub
2. Connect your GitHub repo to Railway
3. Set build command: `cd backend && npm run build`
4. Set start command: `cd backend && npm start`
5. Add environment variables
6. Deploy

### Option 2: Netlify + Render

**Frontend (Netlify):**
1. Push your code to GitHub
2. Connect your GitHub repo to Netlify
3. Set build command: `cd frontend && npm run build`
4. Set publish directory: `frontend/build`
5. Deploy

**Backend (Render):**
1. Push your code to GitHub
2. Connect your GitHub repo to Render
3. Set build command: `cd backend && npm run build`
4. Set start command: `cd backend && npm start`
5. Add environment variables
6. Deploy

## 🔧 Environment Variables

### Backend Environment Variables

Set these in your deployment platform:

```env
PORT=5001
NODE_ENV=production
REMOVE_BG_API_KEY=your_api_key_here
# or
CLOUDINARY_URL=your_cloudinary_url_here
# or
REPLICATE_API_TOKEN=your_token_here
```

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
REACT_APP_API_URL=https://your-backend-url.com
```

## 📝 Pre-deployment Checklist

- [ ] Backend builds successfully (`npm run build`)
- [ ] Frontend builds successfully (`npm run build`)
- [ ] All environment variables are set
- [ ] Background removal API is configured
- [ ] Database/storage is configured
- [ ] CORS is properly configured for production domains

## 🌐 Production URLs

After deployment, update these files with your production URLs:

1. **Frontend**: Update `frontend/src/App.tsx` and other components
2. **Backend**: Update CORS configuration in `backend/src/index.ts`

## 🔒 Security Considerations

- Use HTTPS in production
- Set up proper CORS origins
- Implement rate limiting
- Add API key validation
- Set up monitoring and logging

## 📊 Monitoring

- Set up health check endpoints
- Monitor API response times
- Track error rates
- Set up alerts for failures

## 🚨 Troubleshooting

### Common Deployment Issues

1. **Build fails**: Check Node.js version compatibility
2. **Environment variables not loading**: Verify variable names and values
3. **CORS errors**: Update CORS configuration for production domains
4. **API calls failing**: Check backend URL configuration

### Debug Commands

```bash
# Check backend logs
railway logs
# or
render logs

# Check frontend build
cd frontend && npm run build

# Check backend build
cd backend && npm run build
```

## 🔄 Continuous Deployment

Set up GitHub Actions for automatic deployment:

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./frontend
```

## 📱 Mobile Optimization

- Test responsive design on various devices
- Optimize image loading for mobile
- Ensure touch-friendly interface
- Test on different screen sizes

## 🎯 Performance Optimization

- Enable gzip compression
- Use CDN for static assets
- Implement image lazy loading
- Add caching headers
- Optimize bundle sizes

---

**Need help?** Check the main README.md for troubleshooting tips or create an issue in the repository.
