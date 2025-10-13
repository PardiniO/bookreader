USE bookreader_db

CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS nationality (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS author (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_nationality INT,
    name VARCHAR(100) NOT NULL,
    biography TEXT,
);

CREATE TABLE IF NOT EXISTS genre (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS language (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS book (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_language INT,
    title VARCHAR(255) NOT NULL,
    synopsis TEXT,
    publication_date DATE,
    rating DECIMAL(3, 2),
    cover_url VARCHAR(255),
    external_id VARCHAR(100),
    source ENUM('openlibrary', 'gutendex', 'manual') DEFAULT 'manual'
);

CREATE TABLE IF NOT EXISTS book_author (
    id_book INT NOT NULL,
    id_author INT NOT NULL
);

CREATE TABLE IF NOT EXISTS book_gender (
    id_book INT NOT NULL,
    id_genre INT NOT NULL
);

CREATE TABLE IF NOT EXISTS reading_status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status ENUM('reading', 'to_read', 'read') NOT NULL
);

CREATE TABLE IF NOT EXISTS library (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    id_book INT NOT NULL,
    id_reading_status INT NOT NULL,
    added_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS file (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    mimetype VARCHAR(50),
    path VARCHAR(255) NOT NULL,
    size BIGINIT,
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS book_file (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_book INT NOT NULL,
    id_file INT NOT NULL
);

CREATE TABLE IF NOT EXISTS reading_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    id_file INT NOT NULL,
    current_page INT DEFAULT 0,
    progress_percent DECIMAL(5, 2) DEFAULT 0,
    last_read DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS note (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_progress INT NOT NULL,
    text TEXT NOT NULL,
    page INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS highlight (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_progress INT NOT NULL,
    highlighted_text TEXT NOT NULL,
    page INT,
    color VARCHAR(20)
);