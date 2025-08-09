# Complete Image Upload & Blog API Testing Guide

## 📋 **Implementation Summary**

### ✅ **Image Upload Features:**
- **Multer Configuration:** File uploads with validation
- **Storage Location:** Local folder defined by `UPLOAD_PATH` in `.env`
- **Allowed Formats:** JPEG, PNG, GIF only
- **File Size Limit:** Defined by `MAX_FILE_SIZE` in `.env` (default: 5MB)
- **Unique Naming:** `timestamp_originalname.ext` format
- **Relative Path Return:** `/uploads/filename.jpg` format

### ✅ **Database Schema:**
```sql
CREATE TABLE blogs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    cover_image VARCHAR(255),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### ✅ **API Endpoints:**
- `POST /api/blogs` - Create blog with image upload
- `GET /api/blogs` - Fetch all blogs
- `GET /api/blogs/:id` - Fetch single blog by ID
- `GET /uploads/:filename` - Serve uploaded images

## 🧪 **Testing Examples**

### **1. Create Blog Post with Image (POST /api/blogs)**

#### Using cURL:
```bash
curl -X POST http://localhost:3000/api/blogs \
  -F "title=My Blog with Image" \
  -F "author=John Doe" \
  -F "content=This is a blog post with a beautiful cover image!" \
  -F "cover_image=@C:/path/to/your/image.jpg"
```

#### Using PowerShell:
```powershell
$uri = "http://localhost:3000/api/blogs"
$form = @{
    title = "PowerShell Blog Post"
    author = "Jane Smith"
    content = "This blog was created using PowerShell with an image!"
    cover_image = Get-Item "C:\path\to\your\image.jpg"
}
Invoke-RestMethod -Uri $uri -Method Post -Form $form
```

#### Expected Response:
```json
{
  "success": true,
  "message": "Blog created successfully",
  "data": {
    "id": 1,
    "title": "My Blog with Image",
    "author": "John Doe",
    "cover_image": "/uploads/1691234567890_myimage.jpg",
    "content": "This is a blog post with a beautiful cover image!",
    "created_at": "2024-08-09T10:30:00.000Z"
  }
}
```

### **2. Create Blog Post without Image**

```bash
curl -X POST http://localhost:3000/api/blogs \
  -F "title=Blog Without Image" \
  -F "author=Jane Smith" \
  -F "content=This blog post doesn't need a cover image."
```

#### Expected Response:
```json
{
  "success": true,
  "message": "Blog created successfully",
  "data": {
    "id": 2,
    "title": "Blog Without Image",
    "author": "Jane Smith",
    "cover_image": null,
    "content": "This blog post doesn't need a cover image.",
    "created_at": "2024-08-09T10:35:00.000Z"
  }
}
```

### **3. Get All Blogs (GET /api/blogs)**

```bash
curl http://localhost:3000/api/blogs
```

#### Expected Response:
```json
{
  "success": true,
  "data": {
    "blogs": [
      {
        "id": 1,
        "title": "My Blog with Image",
        "author": "John Doe",
        "cover_image": "/uploads/1691234567890_myimage.jpg",
        "content": "This is a blog post with a beautiful cover image!",
        "created_at": "2024-08-09T10:30:00.000Z"
      },
      {
        "id": 2,
        "title": "Blog Without Image",
        "author": "Jane Smith",
        "cover_image": null,
        "content": "This blog post doesn't need a cover image.",
        "created_at": "2024-08-09T10:35:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalBlogs": 2,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
}
```

### **4. Get Single Blog (GET /api/blogs/:id)**

```bash
curl http://localhost:3000/api/blogs/1
```

### **5. Access Uploaded Image**

```bash
# Direct image access
curl http://localhost:3000/uploads/1691234567890_myimage.jpg

# Or in browser/frontend:
# http://localhost:3000/uploads/1691234567890_myimage.jpg
```

## ⚠️ **Error Handling Examples**

### **File Too Large:**
```json
{
  "success": false,
  "message": "File too large. Maximum size is 5MB."
}
```

### **Invalid File Type:**
```json
{
  "success": false,
  "message": "Invalid file type. Only JPEG, PNG, and GIF files are allowed."
}
```

### **Missing Required Fields:**
```json
{
  "success": false,
  "message": "Title, author, and content are required"
}
```

### **Database Error:**
```json
{
  "success": false,
  "message": "Error creating blog",
  "error": "Database connection failed"
}
```

## 🎨 **Frontend Integration**

### **HTML Form Example:**
```html
<form id="blogForm" enctype="multipart/form-data">
  <input type="text" name="title" placeholder="Blog Title" required>
  <input type="text" name="author" placeholder="Author Name" required>
  <textarea name="content" placeholder="Blog Content" required></textarea>
  <input type="file" name="cover_image" accept="image/jpeg,image/png,image/gif">
  <button type="submit">Create Blog</button>
</form>
```

### **JavaScript Example:**
```javascript
const createBlog = async (formData) => {
  try {
    const response = await fetch('http://localhost:3000/api/blogs', {
      method: 'POST',
      body: formData // FormData object
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Blog created:', result.data);
      
      // Access the image if it exists
      if (result.data.cover_image) {
        const imageUrl = `http://localhost:3000${result.data.cover_image}`;
        console.log('Image URL:', imageUrl);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Usage
const form = document.getElementById('blogForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  createBlog(formData);
});
```

### **React Example:**
```jsx
import React, { useState } from 'react';

const BlogForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    content: ''
  });
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('author', formData.author);
    data.append('content', formData.content);
    if (image) data.append('cover_image', image);

    try {
      const response = await fetch('http://localhost:3000/api/blogs', {
        method: 'POST',
        body: data
      });
      
      const result = await response.json();
      console.log('Blog created:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({...formData, title: e.target.value})}
        required
      />
      <input
        type="text"
        placeholder="Author"
        value={formData.author}
        onChange={(e) => setFormData({...formData, author: e.target.value})}
        required
      />
      <textarea
        placeholder="Content"
        value={formData.content}
        onChange={(e) => setFormData({...formData, content: e.target.value})}
        required
      />
      <input
        type="file"
        accept="image/jpeg,image/png,image/gif"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <button type="submit">Create Blog</button>
    </form>
  );
};

// Display blogs with images
const BlogList = ({ blogs }) => {
  return (
    <div>
      {blogs.map(blog => (
        <div key={blog.id}>
          <h3>{blog.title}</h3>
          <p>By: {blog.author}</p>
          {blog.cover_image && (
            <img 
              src={`http://localhost:3000${blog.cover_image}`} 
              alt={blog.title}
              style={{ maxWidth: '300px' }}
            />
          )}
          <p>{blog.content}</p>
        </div>
      ))}
    </div>
  );
};
```

## 🔧 **Environment Configuration**

### **.env Example:**
```env
PORT=3000
UPLOAD_PATH=uploads
MAX_FILE_SIZE=5242880  # 5MB in bytes
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
DB_PORT=3306
NODE_ENV=development
```

## 📁 **File Structure**
```
Backend/
├── config/
│   └── db.js                 # MySQL connection
├── controllers/
│   └── blogController.js     # Blog CRUD operations
├── middleware/
│   └── upload.js             # Multer configuration
├── routes/
│   └── blogRoutes.js         # API routes
├── uploads/                  # Uploaded images directory
│   └── 1691234567890_image.jpg
├── server.js                 # Main entry point
├── package.json
└── .env                      # Environment variables
```

## 🌐 **CORS Configuration**

Your server already has CORS enabled for frontend access:
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // React dev servers
  credentials: true
}));
```

## ✅ **Complete Implementation Checklist**

- ✅ **Multer for file upload**
- ✅ **Local storage in UPLOAD_PATH folder**
- ✅ **JPEG, PNG, GIF validation**
- ✅ **MAX_FILE_SIZE enforcement**
- ✅ **Unique filename generation (timestamp + original name)**
- ✅ **Relative path return (/uploads/filename.jpg)**
- ✅ **Complete API endpoints (POST, GET all, GET single)**
- ✅ **Correct MySQL schema**
- ✅ **Static file serving**
- ✅ **Comprehensive error handling**
- ✅ **Modular code structure**
- ✅ **CORS enabled**

Your implementation is complete and production-ready! 🎉
