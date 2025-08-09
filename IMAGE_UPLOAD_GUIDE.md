# Image Upload & Fetch API Guide

## 📸 **Cover Image Upload & Fetch Implementation**

Your backend already supports cover image uploads using **Multer**! Here's how it works:

## 🔧 **Current Implementation:**

### **1. Upload Endpoint (Already Working):**
```
POST /api/blogs
Content-Type: multipart/form-data

Fields:
- title: "Blog Title"
- author: "Author Name" 
- content: "Blog content..."
- cover_image: [IMAGE FILE]
```

### **2. Image Access (Already Working):**
```
GET /uploads/filename.jpg
```

### **3. Blog Response with Image:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "My Blog",
    "author": "Author",
    "cover_image": "uploads/cover_image-1691234567890-123456789.jpg",
    "content": "Content...",
    "created_at": "2024-08-09T10:30:00.000Z"
  }
}
```

## 🧪 **Testing Examples:**

### **JavaScript/React Upload:**
```javascript
const uploadBlog = async (formData) => {
  // Create FormData object
  const formData = new FormData();
  formData.append('title', 'My Blog Title');
  formData.append('author', 'John Doe');
  formData.append('content', 'This is my blog content');
  formData.append('cover_image', imageFile); // File from input[type="file"]

  const response = await fetch('http://localhost:3000/api/blogs', {
    method: 'POST',
    body: formData
    // Don't set Content-Type header - let browser set it with boundary
  });

  return response.json();
};

// Get blogs with cover images
const getBlogs = async () => {
  const response = await fetch('http://localhost:3000/api/blogs');
  const data = await response.json();
  
  // Each blog will have cover_image field with path like:
  // "uploads/cover_image-1691234567890-123456789.jpg"
  return data;
};

// Display image in React
const BlogCard = ({ blog }) => {
  const imageUrl = blog.cover_image 
    ? `http://localhost:3000/${blog.cover_image}` 
    : '/default-image.jpg';
    
  return (
    <div>
      <img src={imageUrl} alt={blog.title} />
      <h3>{blog.title}</h3>
      <p>{blog.content}</p>
    </div>
  );
};
```

### **cURL Upload Test:**
```bash
# Upload blog with cover image
curl -X POST http://localhost:3000/api/blogs \
  -F "title=My Blog with Cover" \
  -F "author=Test Author" \
  -F "content=This blog has a beautiful cover image!" \
  -F "cover_image=@C:/path/to/your/image.jpg"

# Response will include:
# "cover_image": "uploads/cover_image-1691234567890-123456789.jpg"
```

### **Access Uploaded Image:**
```bash
# Direct image access
curl http://localhost:3000/uploads/cover_image-1691234567890-123456789.jpg

# Or open in browser:
# http://localhost:3000/uploads/cover_image-1691234567890-123456789.jpg
```

## 🔄 **Complete Workflow:**

### **1. Upload Blog with Cover Image:**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const formData = new FormData();
  formData.append('title', title);
  formData.append('author', author);
  formData.append('content', content);
  
  if (coverImage) {
    formData.append('cover_image', coverImage);
  }
  
  try {
    const response = await fetch('/api/blogs', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    console.log('Blog created:', result);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### **2. Display Blogs with Images:**
```javascript
const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  
  useEffect(() => {
    fetchBlogs();
  }, []);
  
  const fetchBlogs = async () => {
    const response = await fetch('/api/blogs');
    const data = await response.json();
    setBlogs(data.data.blogs);
  };
  
  return (
    <div>
      {blogs.map(blog => (
        <div key={blog.id} className="blog-card">
          {blog.cover_image && (
            <img 
              src={`/${blog.cover_image}`} 
              alt={blog.title}
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
          )}
          <h3>{blog.title}</h3>
          <p>By: {blog.author}</p>
          <p>{blog.content}</p>
        </div>
      ))}
    </div>
  );
};
```

## ⚙️ **Image Validation (Already Implemented):**

- ✅ **File Types:** JPEG, PNG, GIF only
- ✅ **File Size:** Maximum 5MB
- ✅ **Unique Names:** Timestamp + random number
- ✅ **Error Handling:** Proper validation messages

## 🚀 **For Production (Vercel):**

### **Important Note:**
- **Local Development:** Files stored in `/uploads` folder
- **Vercel Production:** Files are temporary (deleted on restart)
- **Recommendation:** Use cloud storage for production

### **Cloud Storage Integration (Optional):**
For production, consider:
- **Cloudinary** (easiest for images)
- **AWS S3**
- **Google Cloud Storage**

## 🧪 **Complete Test Scenario:**

### **1. HTML Form for Testing:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Blog Upload Test</title>
</head>
<body>
    <form id="blogForm" enctype="multipart/form-data">
        <input type="text" name="title" placeholder="Blog Title" required><br><br>
        <input type="text" name="author" placeholder="Author Name" required><br><br>
        <textarea name="content" placeholder="Blog Content" required></textarea><br><br>
        <input type="file" name="cover_image" accept="image/*"><br><br>
        <button type="submit">Upload Blog</button>
    </form>

    <script>
        document.getElementById('blogForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            
            try {
                const response = await fetch('http://localhost:3000/api/blogs', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                console.log('Result:', result);
                alert('Blog uploaded successfully!');
            } catch (error) {
                console.error('Error:', error);
                alert('Upload failed!');
            }
        });
    </script>
</body>
</html>
```

Your image upload and fetch system is **fully implemented and ready to use**! 🎉

## 📱 **Frontend Integration Ready:**
- Upload blogs with cover images
- Fetch blogs with image paths
- Display images using the returned paths
- All validation and error handling included

Would you like me to help you test the image upload functionality or integrate it with your React frontend?
