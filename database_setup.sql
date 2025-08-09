USE buwtytssy9boc6byjtea;

-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(100) NOT NULL,
    cover_image VARCHAR(255),
    content LONGTEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Check table structure
DESCRIBE blogs;

-- Show all tables in database
SHOW TABLES;

-- Sample insert to test (optional)
INSERT INTO blogs (title, author, content) VALUES 
('Welcome to My Blog', 'Admin', 'This is the first blog post on our new website!');

-- Check inserted data
SELECT * FROM blogs;
