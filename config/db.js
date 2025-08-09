import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create connection pool for better performance
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// Initialize database and create tables if they don't exist
const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Create blogs table (database already exists on Clever Cloud)
    const createBlogsTable = `
      CREATE TABLE IF NOT EXISTS blogs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(100) NOT NULL,
        cover_image VARCHAR(255),
        content LONGTEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    
    await connection.query(createBlogsTable);
    console.log('✅ Database tables initialized successfully');
    
    connection.release();
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  }
};

export { pool, testConnection, initializeDatabase };
