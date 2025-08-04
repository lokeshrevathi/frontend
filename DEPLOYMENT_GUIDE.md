# Project Management Dashboard - Deployment Guide

## Overview
This guide will help you deploy your React.js Project Management Dashboard to Vercel.

## Prerequisites
- Node.js installed (version 14 or higher)
- Git repository with your code
- Vercel account (free at https://vercel.com)

## Backend Configuration
- **Backend URL**: `https://backend-z5zf.onrender.com`
- **Authentication**: JWT-based
- **API Endpoints**: RESTful API with Django REST Framework

## Local Setup Verification

### 1. Environment Variables
Ensure your `.env` file contains:
```bash
REACT_APP_API_URL=https://backend-z5zf.onrender.com
```

### 2. Build Test
Run the following commands to verify everything works:
```bash
npm install
npm run build
```

The build should complete successfully and create a `build/` folder.

## Vercel Deployment

### Method 1: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from your project directory**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project? → No (for first deployment)
   - Project name → `project-management-dashboard` (or your preferred name)
   - Directory → `./` (current directory)
   - Override settings? → No

5. **Set Environment Variables** (if prompted):
   - `REACT_APP_API_URL` = `https://backend-z5zf.onrender.com`

### Method 2: Using Vercel Dashboard

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**

3. **Click "New Project"**

4. **Import your repository**

5. **Configure the project**:
   - Framework Preset: `Create React App`
   - Root Directory: `./` (if your React app is in the root)
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

6. **Add Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add: `REACT_APP_API_URL` = `https://backend-z5zf.onrender.com`

7. **Deploy**

## Post-Deployment Configuration

### 1. Custom Domain (Optional)
- Go to Project Settings → Domains
- Add your custom domain if desired

### 2. Environment Variables Verification
- Ensure `REACT_APP_API_URL` is set correctly in Vercel dashboard
- Redeploy if needed after adding environment variables

### 3. CORS Configuration
The backend should already be configured to accept requests from Vercel domains. If you encounter CORS issues:
- Contact backend administrator to whitelist your Vercel domain
- Vercel domains follow the pattern: `https://your-project.vercel.app`

## Testing the Deployment

### 1. Basic Functionality
- [ ] Homepage loads correctly
- [ ] Login/Register forms work
- [ ] API calls to backend succeed
- [ ] JWT authentication works
- [ ] All routes are accessible

### 2. Feature Testing
- [ ] User registration and login
- [ ] Project creation and management
- [ ] Task assignment and management
- [ ] Role-based access control
- [ ] Time logging functionality

### 3. Error Handling
- [ ] 404 errors redirect to homepage
- [ ] API errors show appropriate messages
- [ ] Network errors are handled gracefully

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (should be 14+)
   - Ensure all dependencies are in `package.json`
   - Check for syntax errors in code

2. **Environment Variables Not Working**
   - Verify variable names start with `REACT_APP_`
   - Redeploy after adding environment variables
   - Check Vercel dashboard settings

3. **API Connection Issues**
   - Verify backend URL is correct
   - Check CORS configuration on backend
   - Test API endpoints directly

4. **Routing Issues**
   - Ensure `vercel.json` is configured correctly
   - Check that all routes redirect to `index.html`

### Debug Commands
```bash
# Test build locally
npm run build

# Test production build locally
npx serve -s build

# Check environment variables
echo $REACT_APP_API_URL

# Verify API connectivity
curl https://backend-z5zf.onrender.com/health/
```

## Performance Optimization

### 1. Build Optimization
- Code splitting is already configured
- Gzip compression is enabled
- Static assets are optimized

### 2. Caching
- Vercel automatically caches static assets
- API responses should be cached appropriately on backend

### 3. Monitoring
- Use Vercel Analytics (optional)
- Monitor API response times
- Check for 404 errors in Vercel dashboard

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` files to version control
   - Use Vercel's environment variable system
   - Rotate API keys regularly

2. **API Security**
   - JWT tokens are stored in localStorage
   - HTTPS is enforced by Vercel
   - CORS is configured on backend

3. **Authentication**
   - Tokens expire automatically
   - Refresh token mechanism is implemented
   - Logout clears all tokens

## Maintenance

### Regular Tasks
- Monitor Vercel dashboard for errors
- Update dependencies regularly
- Test API connectivity
- Review and update environment variables

### Updates
- Push changes to your repository
- Vercel automatically redeploys
- Test thoroughly after updates

## Support

If you encounter issues:
1. Check Vercel documentation: https://vercel.com/docs
2. Review build logs in Vercel dashboard
3. Test locally with `npm run build`
4. Check browser console for errors

## Alternative Deployment Platforms

If Vercel doesn't meet your needs, consider:
- **Netlify**: Similar to Vercel, great for React apps
- **GitHub Pages**: Free, good for static sites
- **Firebase Hosting**: Google's hosting solution
- **AWS Amplify**: AWS's hosting platform

All these platforms support React applications and can be configured similarly. 