# Vercel Deployment Guide for Blog Backend

## 📋 Pre-deployment Checklist

✅ **Files Ready:**
- `package.json` - Updated with Node.js version requirement
- `vercel.json` - Vercel configuration file
- `server.js` - Updated port for Vercel
- `.env.example` - Environment variables template

## 🚀 Deployment Steps

### 1. **Install Vercel CLI (Optional)**
```bash
npm install -g vercel
```

### 2. **Push to GitHub**
```bash
# Add all files
git add .

# Commit changes
git commit -m "Configure for Vercel deployment"

# Push to GitHub
git push origin main
```

### 3. **Deploy on Vercel**

#### **Option A: Using Vercel Dashboard (Recommended)**
1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "Add New..." → "Project"**
3. **Import your GitHub repository:** `khawarrustam/Blog-Backend`
4. **Configure the project:**
   - **Framework Preset:** Other
   - **Root Directory:** `./` (leave default)
   - **Build Command:** `npm install`
   - **Output Directory:** `./` (leave default)
   - **Install Command:** `npm install`

#### **Option B: Using Vercel CLI**
```bash
# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Link to existing project? N
# - Project name: blog-backend
# - Directory: ./
```

### 4. **Environment Variables**
In Vercel dashboard, go to **Settings → Environment Variables** and add:

```
DB_HOST=buwtytssy9boc6byjtea-mysql.services.clever-cloud.com
DB_USER=urmmjuinlsvsthrh
DB_PASSWORD=rF1oVEVog5UaAfGlcOCl
DB_NAME=buwtytssy9boc6byjtea
DB_PORT=3306
UPLOAD_PATH=uploads
MAX_FILE_SIZE=5242880
NODE_ENV=production
```

**Important:** Add these to all environments (Production, Preview, Development)

### 5. **Deploy**
- Click **"Deploy"** 
- Vercel will automatically build and deploy your backend
- Deployment usually takes 1-2 minutes

## 🔗 **Your Live API**

Once deployed, your API will be available at:
- **Base URL:** `https://your-project-name.vercel.app`
- **Health Check:** `https://your-project-name.vercel.app/api/health`
- **Blogs API:** `https://your-project-name.vercel.app/api/blogs`

## 🧪 **Testing Your Live API**

```bash
# Test health endpoint
curl https://your-project-name.vercel.app/api/health

# Get all blogs
curl https://your-project-name.vercel.app/api/blogs

# Create a new blog
curl -X POST https://your-project-name.vercel.app/api/blogs \
  -F "title=My First Vercel Blog" \
  -F "author=Your Name" \
  -F "content=This blog was created on my live Vercel deployment!"
```

## ⚙️ **Important Notes**

### **File Uploads on Vercel:**
- ⚠️ **Vercel has serverless limitations for file uploads**
- Files are stored temporarily and may not persist
- **Recommended:** Use cloud storage (Cloudinary, AWS S3) for production images
- Current setup works for testing, but consider cloud storage for production

### **Database:**
- ✅ Your Clever Cloud MySQL database works perfectly with Vercel
- No additional database setup needed

### **Auto-Deploy:**
- ✅ Any push to your `main` branch triggers automatic redeployment
- Perfect for continuous deployment

### **Custom Domain (Optional):**
- You can add a custom domain in Vercel dashboard
- Free SSL certificates included

### **Function Timeouts:**
- Vercel free tier: 10 seconds timeout
- Vercel Pro: 60 seconds timeout
- Should be sufficient for your blog API

## 🔄 **Updating Your Deployment**

To update your backend:
1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update: your changes description"
   git push origin main
   ```
3. Vercel will automatically redeploy

## 🛠️ **Troubleshooting**

**If deployment fails:**
1. Check the build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Verify environment variables are set correctly
4. Check that `vercel.json` is properly configured

**Database connection issues:**
1. Verify your Clever Cloud MySQL credentials in environment variables
2. Check if your Clever Cloud database allows external connections
3. Test database connection locally first

**File upload issues:**
1. Remember Vercel's serverless nature - files don't persist
2. Consider implementing cloud storage for production

## 📱 **Frontend Integration**

Update your React frontend to use the live API:
```javascript
// Replace localhost with your Vercel URL
const API_BASE_URL = 'https://your-project-name.vercel.app';

const fetchBlogs = async () => {
  const response = await fetch(`${API_BASE_URL}/api/blogs`);
  return response.json();
};
```

## 🌟 **Vercel Features You Get:**

- ⚡ **Edge Network:** Global CDN for fast response times
- 🔒 **Automatic HTTPS:** SSL certificates included
- 📊 **Analytics:** Built-in performance monitoring
- 🚀 **Serverless Functions:** Automatic scaling
- 🔄 **Git Integration:** Automatic deployments from GitHub

Your backend is now ready for production deployment on Vercel! 🎉

## 🔗 **Useful Links:**
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Documentation](https://vercel.com/docs)
- [Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)
