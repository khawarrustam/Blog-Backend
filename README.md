# Blog Backend API

A complete backend solution for a blog website built with Express.js and MySQL.

## Features

- ✅ CRUD operations for blog posts
- ✅ Image upload with validation (JPEG, PNG, GIF, max 5MB)
- ✅ Search functionality by title or author
- ✅ Pagination support
- ✅ Input validation and error handling
- ✅ CORS enabled for frontend integration
- ✅ Clean, modular code structure

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## Installation

1. **Clone and setup:**
   ```bash
   cd Backend
   npm install
   ```

2. **Configure environment:**
   - Update `.env` file with your MySQL credentials:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=blogdb
   ```

3. **Setup MySQL:**
   - Create a MySQL user and database (the app will auto-create tables)
   - Or use an existing MySQL setup

4. **Start the server:**
   ```bash
   # Development with auto-restart
   npm run dev

   # Production
   npm start
   ```

## API Endpoints

### Blog Posts

| Method | Endpoint | Description | Body/Query Params |
|--------|----------|-------------|-------------------|
| GET | `/api/blogs` | Get all blogs | `?search=term&page=1&limit=10` |
| GET | `/api/blogs/:id` | Get single blog | - |
| POST | `/api/blogs` | Create new blog | `title, author, content, cover_image` (form-data) |
| PUT | `/api/blogs/:id` | Update blog | `title, author, content, cover_image` (form-data) |
| DELETE | `/api/blogs/:id` | Delete blog | - |

### Utility

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/` | API info |

## Request Examples

### Create Blog Post (POST /api/blogs)
```bash
# Using curl with form-data
curl -X POST http://localhost:5000/api/blogs \
  -F "title=My First Blog Post" \
  -F "author=John Doe" \
  -F "content=This is the content of my blog post..." \
  -F "cover_image=@/path/to/image.jpg"
```

### Get All Blogs with Search
```bash
curl "http://localhost:5000/api/blogs?search=javascript&page=1&limit=5"
```

### Update Blog Post (PUT /api/blogs/1)
```bash
curl -X PUT http://localhost:5000/api/blogs/1 \
  -F "title=Updated Blog Title" \
  -F "author=Jane Doe" \
  -F "cover_image=@/path/to/new-image.jpg"
```

## Database Schema

### `blogs` table:
```sql
CREATE TABLE blogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(100) NOT NULL,
  cover_image VARCHAR(255),
  content LONGTEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Project Structure

```
Backend/
├── config/
│   └── db.js              # Database connection and setup
├── controllers/
│   └── blogController.js  # Business logic for blog operations
├── middleware/
│   └── upload.js          # Multer configuration for file uploads
├── routes/
│   └── blogRoutes.js      # API route definitions
├── uploads/               # Directory for uploaded images
├── .env                   # Environment variables
├── package.json           # Dependencies and scripts
└── server.js              # Main application entry point
```

## Image Upload Details

- **Accepted formats:** JPEG, PNG, GIF
- **Max file size:** 5MB
- **Storage:** Local filesystem in `/uploads` folder
- **Path storage:** Relative paths stored in database
- **Access:** Images served statically at `/uploads/filename`

## Error Handling

All endpoints return consistent JSON responses:

### Success Response:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error info"
}
```

## Development Notes

- The app automatically creates the database and tables on first run
- Images are automatically deleted when blog posts are removed
- All file uploads are validated for type and size
- CORS is configured for common React development ports (3000, 5173)

## Testing with Postman

1. Import the following collection or create requests manually
2. Set base URL to `http://localhost:5000`
3. For file uploads, use form-data and attach files to `cover_image` field
4. Include other fields (`title`, `author`, `content`) as form-data text

## Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Configure proper MySQL connection
3. Set up proper CORS origins for your frontend domain
4. Consider using a cloud storage service for images instead of local filesystem
5. Set up proper logging and monitoring

## License

ISC
