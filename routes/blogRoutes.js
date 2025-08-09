import express from 'express';
import {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog
} from '../controllers/blogController.js';
import { uploadSingle, handleUploadError } from '../middleware/upload.js';

const router = express.Router();

// GET /api/blogs - Get all blogs with search and pagination
router.get('/', getAllBlogs);

// GET /api/blogs/:id - Get single blog by ID
router.get('/:id', getBlogById);

// POST /api/blogs - Create new blog with image upload
router.post('/', uploadSingle, handleUploadError, createBlog);

// PUT /api/blogs/:id - Update blog with optional image upload
router.put('/:id', uploadSingle, handleUploadError, updateBlog);

// DELETE /api/blogs/:id - Delete blog and associated image
router.delete('/:id', deleteBlog);

export default router;
