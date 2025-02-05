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

-- -- Categories table - store categories
-- CREATE TABLE IF NOT EXISTS categories (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     name TEXT NOT NULL UNIQUE
-- );

-- -- Post_Categories table - for relationship between posts and categories
-- CREATE TABLE IF NOT EXISTS post_categories (
--     post_id INTEGER,
--     category_id INTEGER,
--     PRIMARY KEY (post_id, category_id),
--     FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
--     FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
-- );

-- -- reactions table - stores both likes and dislikes
-- CREATE TABLE IF NOT EXISTS reactions (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     user_id INTEGER NOT NULL,
--     post_id INTEGER,
--     comment_id INTEGER,
--     is_like BOOLEAN NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
--     FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
--     FOREIGN KEY (comment_id) REFERENCES comments (id) ON DELETE CASCADE,
--     UNIQUE (user_id, post_id, comment_id)
-- );

