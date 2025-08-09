# Blog API Testing Guide

## Quick Test Commands

### 1. Test Server Health
```bash
curl http://localhost:5000/api/health
```

### 2. Create a Blog Post (with image)
```bash
# Using curl (replace path/to/image.jpg with actual image path)
curl -X POST http://localhost:5000/api/blogs \
  -F "title=My First Blog Post" \
  -F "author=John Doe" \
  -F "content=This is a sample blog post content. It can be very long and contain rich text formatting." \
  -F "cover_image=@C:/path/to/your/image.jpg"
```

### 3. Create a Blog Post (without image)
```bash
curl -X POST http://localhost:5000/api/blogs \
  -F "title=Blog Without Image" \
  -F "author=Jane Smith" \
  -F "content=This blog post doesn't have a cover image, which is perfectly fine!"
```

### 4. Get All Blogs
```bash
curl http://localhost:5000/api/blogs
```

### 5. Get Blogs with Search
```bash
curl "http://localhost:5000/api/blogs?search=first&page=1&limit=5"
```

### 6. Get Single Blog
```bash
curl http://localhost:5000/api/blogs/1
```

### 7. Update Blog
```bash
curl -X PUT http://localhost:5000/api/blogs/1 \
  -F "title=Updated Blog Title" \
  -F "author=Updated Author"
```

### 8. Delete Blog
```bash
curl -X DELETE http://localhost:5000/api/blogs/1
```

## PowerShell Commands (Windows)

### Create Blog with PowerShell
```powershell
$uri = "http://localhost:5000/api/blogs"
$form = @{
    title = "PowerShell Blog Post"
    author = "PowerShell User"
    content = "This blog was created using PowerShell!"
}

# Without image
Invoke-RestMethod -Uri $uri -Method Post -Form $form

# With image (update path)
$form.cover_image = Get-Item "C:\path\to\your\image.jpg"
Invoke-RestMethod -Uri $uri -Method Post -Form $form
```

## Postman Collection

### Setup Postman Environment
1. Create new environment with:
   - `base_url`: `http://localhost:5000`

### Test Requests:

#### 1. Health Check
- **Method**: GET
- **URL**: `{{base_url}}/api/health`

#### 2. Create Blog
- **Method**: POST
- **URL**: `{{base_url}}/api/blogs`
- **Body**: form-data
  - `title`: "My Blog Title"
  - `author`: "Author Name"
  - `content`: "Blog content here..."
  - `cover_image`: [Select File]

#### 3. Get All Blogs
- **Method**: GET
- **URL**: `{{base_url}}/api/blogs`
- **Query Params** (optional):
  - `search`: "keyword"
  - `page`: "1"
  - `limit`: "10"

#### 4. Get Single Blog
- **Method**: GET
- **URL**: `{{base_url}}/api/blogs/1`

#### 5. Update Blog
- **Method**: PUT
- **URL**: `{{base_url}}/api/blogs/1`
- **Body**: form-data
  - `title`: "Updated Title"
  - `author`: "Updated Author"
  - `content`: "Updated content..."
  - `cover_image`: [Select File] (optional)

#### 6. Delete Blog
- **Method**: DELETE
- **URL**: `{{base_url}}/api/blogs/1`

## Expected Response Formats

### Success Response
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Blog Title",
    "author": "Author Name",
    "cover_image": "uploads/cover_image-1691234567890-123456789.jpg",
    "content": "Blog content...",
    "created_at": "2024-08-09T10:30:00.000Z",
    "updated_at": "2024-08-09T10:30:00.000Z"
  },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": {
    "blogs": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalBlogs": 50,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

## Testing Image Upload

### Valid Image Types:
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)

### File Size Limit:
- Maximum: 5MB

### Test with Sample Images:
1. Create or download test images in different formats
2. Test with files larger than 5MB (should fail)
3. Test with invalid file types like .txt or .pdf (should fail)

## Frontend Integration

### Fetch API Examples for React:

#### Create Blog with Image:
```javascript
const createBlog = async (formData) => {
  const response = await fetch('http://localhost:5000/api/blogs', {
    method: 'POST',
    body: formData // FormData object with title, author, content, cover_image
  });
  return response.json();
};
```

#### Get All Blogs:
```javascript
const getBlogs = async (search = '', page = 1, limit = 10) => {
  const url = new URL('http://localhost:5000/api/blogs');
  url.searchParams.append('search', search);
  url.searchParams.append('page', page);
  url.searchParams.append('limit', limit);
  
  const response = await fetch(url);
  return response.json();
};
```
