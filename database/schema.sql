CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  
    nickname TEXT  NOT NULL UNIQUE,
    age INTEGER NOT NULL,
    gender TEXT  NOT NULL,
    firstName TEXT  NOT NULL,
    lastName TEXT  NOT NULL,
    email TEXT  NOT NULL UNIQUE,
    password TEXT NOT NULL
);

-- Sessions table - manage user authentication
CREATE TABLE IF NOT EXISTS sesions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sesion TEXT NOT NULL,
    exp_date DATETIME,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- -- Posts table - stores all forum posts
CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nickname TEXT UNIQUE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    categories TEXT,
    FOREIGN KEY (post_id) REFERENCES posts (id)
);

-- Comments table - stores post comments
CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- -- reactions table - stores both likes and dislikes
CREATE TABLE if NOT EXISTS likes(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    TypeOfLike TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    comment_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
    FOREIGN KEY (post_id) REFERENCES posts (id)
    FOREIGN KEY (comment_id) REFERENCES comments (id)

);





