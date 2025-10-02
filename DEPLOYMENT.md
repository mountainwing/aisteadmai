# Deployment Guide for Love Landing Page

## 🚀 Deploy to Vercel

This guide will help you deploy your Love Landing Page to Vercel with full-stack functionality.

### Prerequisites

1. **MongoDB Atlas Account** (recommended for production)
   - Sign up at [MongoDB Atlas](https://cloud.mongodb.com/)
   - Create a new cluster
   - Get your connection string

2. **GitHub Account**
   - Your code needs to be in a GitHub repository

3. **Vercel Account**
   - Sign up at [vercel.com](https://vercel.com)
   - Connect your GitHub account

### Step 1: Prepare Your MongoDB Database

1. **Set up MongoDB Atlas:**
   - Create a new project
   - Build a new cluster (free tier is fine)
   - Create a database user with read/write permissions
   - Add your IP address to the Network Access whitelist (or use 0.0.0.0/0 for all IPs)
   - Get your connection string from the "Connect" button

2. **Your connection string should look like:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 2: Push to GitHub

1. **Initialize Git repository (if not already done):**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Love landing page"
   ```

2. **Create a new repository on GitHub:**
   - Go to github.com and create a new repository
   - Name it something like "love-ly-landing"
   - Don't initialize with README since you already have files

3. **Push your code:**
   ```bash
   git remote add origin https://github.com/yourusername/love-ly-landing.git
   git branch -M main
   git push -u origin main
   ```

### Step 3: Deploy to Vercel

1. **Connect Vercel to GitHub:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository

2. **Configure Environment Variables:**
   - In Vercel project settings, go to "Environment Variables"
   - Add these variables:
     ```
     MONGODB_URI = your_mongodb_connection_string
     MONGODB_DB_NAME = _ethan_boyfriend_proposal
     ```

3. **Deploy:**
   - Vercel will automatically detect it's a Vite app
   - Click "Deploy"
   - Wait for deployment to complete

### Step 4: Configure Your App for Production

1. **Update API URLs in your React app:**
   - Your app is already configured to work with relative API paths
   - The `/api/*` routes will automatically work with Vercel serverless functions

2. **Test your deployment:**
   - Visit your deployed URL (Vercel will provide this)
   - Test login functionality
   - Test editing features
   - Test image upload (Note: uploaded files won't persist on Vercel's free tier)

### Important Notes

#### File Uploads
- **Important:** File uploads are currently disabled in the Vercel deployment due to serverless limitations
- **Workaround:** You can still add media by:
  1. Manually adding image URLs to your MongoDB `media` collection
  2. Using external image hosting services (Imgur, Cloudinary, etc.)
- **For full file upload functionality:** Consider using:
  - Cloudinary (recommended for images/videos)
  - AWS S3 with signed URLs
  - Google Cloud Storage

#### Database Collections
Your app uses these MongoDB collections:
- `hero` - Main landing page content
- `reasons` - Love reasons list
- `reasonheader` - Section header for reasons
- `proposal` - Proposal section content (title, question, button text, success messages)
- `media` - Uploaded photos/videos metadata

#### Login Credentials
Currently hardcoded in the app:
- **Boyfriend:** username: `boyboy`, password: `ethanethan`
- **Girlfriend:** username: `girlgirl`, password: `cherylcheryl`

**For production, consider:**
- Using environment variables for credentials
- Implementing proper authentication
- Adding password hashing

### Troubleshooting

#### Common Issues:

1. **MongoDB Connection Failed:**
   - Check your connection string
   - Ensure IP whitelist includes 0.0.0.0/0
   - Verify username/password

2. **API Routes Not Working (404 errors):**
   - **First, test the simple API**: Try accessing `/api/test` on your deployed site to see if basic API routing works
   - **Check Vercel function logs** in your Vercel dashboard under the "Functions" tab
   - **Ensure environment variables are set correctly:**
     - `MONGODB_URI` (your full MongoDB connection string)
     - `MONGODB_DB_NAME` (set to `_ethan_boyfriend_proposal`)
   - **Verify Node.js version**: Make sure your package.json includes `"engines": { "node": ">=18.0.0" }`
   - **Check deployment logs**: Look for build errors in Vercel deployment logs
   - **MongoDB Atlas setup**: Ensure IP whitelist includes `0.0.0.0/0` for all IPs
   - **Test individual endpoints**: Try `/api/health`, `/api/hero`, `/api/reasons`, `/api/proposal` separately

3. **Build Errors:**
   - Check the build logs in Vercel
   - Ensure all dependencies are in `package.json`
   - Verify TypeScript compilation

### Environment Variables Reference

```bash
# Required for production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=_ethan_boyfriend_proposal

# Optional
API_PORT=3001  # Not used in Vercel, but kept for local development
```

### Custom Domain (Optional)

1. **In Vercel Dashboard:**
   - Go to your project settings
   - Click "Domains"
   - Add your custom domain
   - Configure DNS as instructed

### Continuous Deployment

- Vercel automatically redeploys when you push to your main branch
- Each deployment gets a unique URL for testing
- Production deployment uses your main domain

---

## 🎉 Your Love Landing Page is Live!

Once deployed, share your custom URL with your loved one. Every edit you make will automatically deploy to the live site!

### Next Steps

1. **Customize the content** using the edit features
2. **Add your photos and videos** to the gallery
3. **Share the URL** with your special someone
4. **Consider upgrading** to paid plans for better performance and features

Enjoy your beautiful love landing page! ❤️