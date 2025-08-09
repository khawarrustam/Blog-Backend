import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Import database configuration
import { testConnection, initializeDatabase } from './config/db.js';

// Import routes
import blogRoutes from './routes/blogRoutes.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000; // Vercel uses any port

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:5173', 
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    /\.vercel\.app$/, // Allow all Vercel domains
    /\.netlify\.app$/, // Allow Netlify domains if needed
  ],
  credentials: true
}));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from uploads directory
const uploadPath = process.env.UPLOAD_PATH || 'uploads';
app.use(`/${uploadPath}`, express.static(path.join(__dirname, uploadPath)));

// Image info endpoint
app.get('/api/image/:filename', (req, res) => {
  const { filename } = req.params;
  const imagePath = path.join(__dirname, 'uploads', filename);
  
  // Check if file exists
  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({
      success: false,
      message: 'Image not found'
    });
  }
  
  // Get file stats
  const stats = fs.statSync(imagePath);
  const fileExtension = path.extname(filename).toLowerCase();
  
  res.json({
    success: true,
    data: {
      filename,
      size: stats.size,
      created: stats.birthtime,
      type: fileExtension,
      url: `/uploads/${filename}`
    }
  });
});

// Routes
app.use('/api/blogs', blogRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Blog API is running successfully',
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Blog API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      blogs: '/api/blogs',
      'single blog': '/api/blogs/:id'
    }
  });
});

// Handle 404 for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Initialize database tables
    await initializeDatabase();
    
    // Start the server (only if not in Vercel environment)
    if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
      app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
        console.log(`📱 API Base URL: http://localhost:${PORT}`);
        console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
        console.log(`📚 Blogs API: http://localhost:${PORT}/api/blogs`);
        console.log('✅ Ready to accept requests!');
      });
    }
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start the application
startServer();

// Export for Vercel
export default app;
