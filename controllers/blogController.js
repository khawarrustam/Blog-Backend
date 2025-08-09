import { pool } from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all blogs with search and pagination
export const getAllBlogs = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    let query = 'SELECT * FROM blogs';
    let countQuery = 'SELECT COUNT(*) as total FROM blogs';
    let queryParams = [];
    let countParams = [];
    
    // Add search functionality
    if (search) {
      const searchCondition = ' WHERE title LIKE ? OR author LIKE ?';
      query += searchCondition;
      countQuery += searchCondition;
      queryParams = [`%${search}%`, `%${search}%`];
      countParams = [`%${search}%`, `%${search}%`];
    }
    
    // Add ordering and pagination
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    queryParams.push(parseInt(limit), offset);
    
    // Execute queries separately to avoid parameter confusion
    const [countResult] = await pool.query(countQuery, countParams);
    const [blogs] = await pool.query(query, queryParams);
    
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / parseInt(limit));
    
    res.json({
      success: true,
      data: {
        blogs,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalBlogs: total,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blogs',
      error: error.message
    });
  }
};

// Get single blog by ID
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.query('SELECT * FROM blogs WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blog',
      error: error.message
    });
  }
};

// Create new blog
export const createBlog = async (req, res) => {
  try {
    const { title, author, content } = req.body;
    
    // Validation
    if (!title || !author || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title, author, and content are required'
      });
    }
    
    if (title.length > 255) {
      return res.status(400).json({
        success: false,
        message: 'Title must not exceed 255 characters'
      });
    }
    
    if (author.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Author name must not exceed 100 characters'
      });
    }
    
    // Get image path if uploaded - return relative path for frontend
    const coverImage = req.file ? `/${process.env.UPLOAD_PATH || 'uploads'}/${req.file.filename}` : null;
    
    // Insert into database
    const [result] = await pool.query(
      'INSERT INTO blogs (title, author, cover_image, content) VALUES (?, ?, ?, ?)',
      [title, author, coverImage, content]
    );
    
    // Fetch the created blog
    const [newBlog] = await pool.query('SELECT * FROM blogs WHERE id = ?', [result.insertId]);
    
    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: newBlog[0]
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating blog',
      error: error.message
    });
  }
};

// Update blog
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, content } = req.body;
    
    // Check if blog exists
    const [existingBlog] = await pool.query('SELECT * FROM blogs WHERE id = ?', [id]);
    
    if (existingBlog.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    // Validation
    if (title && title.length > 255) {
      return res.status(400).json({
        success: false,
        message: 'Title must not exceed 255 characters'
      });
    }
    
    if (author && author.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Author name must not exceed 100 characters'
      });
    }
    
    // Handle image update
    let coverImage = existingBlog[0].cover_image;
    if (req.file) {
      // Delete old image if it exists
      if (coverImage) {
        const oldImagePath = path.join(__dirname, '..', coverImage.replace(/^\//, '')); // Remove leading slash
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      coverImage = `/${process.env.UPLOAD_PATH || 'uploads'}/${req.file.filename}`;
    }
    
    // Update blog
    const updateFields = [];
    const updateValues = [];
    
    if (title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }
    if (author !== undefined) {
      updateFields.push('author = ?');
      updateValues.push(author);
    }
    if (content !== undefined) {
      updateFields.push('content = ?');
      updateValues.push(content);
    }
    if (req.file) {
      updateFields.push('cover_image = ?');
      updateValues.push(coverImage);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }
    
    updateValues.push(id);
    
    await pool.query(
      `UPDATE blogs SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );
    
    // Fetch updated blog
    const [updatedBlog] = await pool.query('SELECT * FROM blogs WHERE id = ?', [id]);
    
    res.json({
      success: true,
      message: 'Blog updated successfully',
      data: updatedBlog[0]
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating blog',
      error: error.message
    });
  }
};

// Delete blog
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if blog exists
    const [existingBlog] = await pool.query('SELECT * FROM blogs WHERE id = ?', [id]);
    
    if (existingBlog.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    // Delete associated image file
    const coverImage = existingBlog[0].cover_image;
    if (coverImage) {
      const imagePath = path.join(__dirname, '..', coverImage.replace(/^\//, '')); // Remove leading slash
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Delete blog from database
    await pool.query('DELETE FROM blogs WHERE id = ?', [id]);
    
    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting blog',
      error: error.message
    });
  }
};
