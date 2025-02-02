CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  
    nickname TEXT  NOT NULL,
    age TEXT  NOT NULL,
    gender TEXT  NOT NULL,
    firstName TEXT  NOT NULL,
    lastName TEXT  NOT NULL,
    email TEXT  NOT NULL,
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
    nickname TEXT,
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

-- Assuming we have users with IDs 1-5, insert 20 posts
INSERT INTO posts (nickname, title, content, user_id) VALUES
    ('TechGuru', 'Getting Started with Go Programming', 'Go is a statically typed, compiled programming language designed at Google. In this post, I want to share my experience learning Go and some basic concepts that helped me understand the language better. The strong typing and simple syntax make it an excellent choice for beginners.', 1),
    
    ('SportsFan', 'The Evolution of Basketball Strategy', 'Modern basketball has changed dramatically over the last decade. The emphasis on three-point shooting and position-less basketball has transformed how teams approach both offense and defense. This post explores these tactical changes and their impact on the game.', 2),
    
    ('BookWorm', 'Must-Read Science Fiction Novels of 2024', 'Science fiction continues to push boundaries and explore new ideas. Here are some groundbreaking novels that combine compelling storytelling with innovative concepts. From AI ethics to space exploration, these books tackle contemporary issues through a sci-fi lens.', 3),
    
    ('FoodieExplorer', 'Traditional Recipes with Modern Twists', 'Fusion cuisine doesn''t have to be complicated. Sometimes, small changes to traditional recipes can create exciting new flavors while maintaining the essence of the original dish. Here are some of my favorite experiments in combining culinary traditions.', 4),
    
    ('GreenThumb', 'Urban Gardening Tips for Beginners', 'You don''t need a large space to start growing your own food. This guide covers everything you need to know about starting a small urban garden, from choosing the right containers to selecting plants that thrive in limited spaces.', 5),
    
    ('CodeNinja', 'Understanding Database Indexing', 'Database performance can make or break your application. In this deep dive, we''ll explore how indexing works, when to use it, and common pitfalls to avoid. Examples will be provided using popular database systems.', 1),
    
    ('HealthCoach', 'Sustainable Fitness Habits', 'Creating lasting fitness habits isn''t about intense short-term programs. It''s about building sustainable routines that you can maintain long-term. Here''s how to develop a fitness routine that sticks.', 2),
    
    ('ArtLover', 'Digital Art Tools Comparison', 'With so many digital art tools available, choosing the right one can be overwhelming. This post compares popular software options, considering factors like price, features, and learning curve.', 3),
    
    ('TravelBug', 'Hidden Gems in Local Travel', 'Sometimes the best adventures are right in your backyard. Discover how to be a tourist in your own city and uncover hidden gems that even locals might not know about.', 4),
    
    ('MusicPro', 'Home Recording Studio Essentials', 'Setting up a home recording studio doesn''t have to break the bank. Here''s a guide to the essential equipment you need to start recording professional-quality audio at home.', 5),
    
    ('CyberSec', 'Cybersecurity Best Practices', 'In an increasingly connected world, protecting your digital life is crucial. Learn about essential security practices that everyone should implement to stay safe online.', 1),
    
    ('EcoWarrior', 'Sustainable Living on a Budget', 'Living sustainably doesn''t have to be expensive. This guide provides practical tips for reducing your environmental impact while saving money.', 2),
    
    ('PetWhisperer', 'Understanding Cat Behavior', 'Cats communicate in subtle ways. Learning to read their body language and understand their needs can help build a stronger bond with your feline friend.', 3),
    
    ('DIYMaster', 'Basic Home Repairs Everyone Should Know', 'Some home repairs don''t require a professional. Learn these basic maintenance skills to save money and become more self-reliant.', 4),
    
    ('StartupFounder', 'Lessons from My First Year in Business', 'Starting a business is a journey filled with unexpected challenges and valuable lessons. Here are the key insights from my first year as a founder.', 5),
    
    ('PhotoPro', 'Smartphone Photography Tips', 'You don''t need expensive equipment to take great photos. These techniques will help you make the most of your smartphone camera.', 1),
    
    ('MindfulLiving', 'Introduction to Meditation', 'Meditation doesn''t have to be complicated. Start with these simple techniques to build a daily mindfulness practice.', 2),
    
    ('CarEnthusiast', 'Basic Car Maintenance Guide', 'Regular maintenance can extend your car''s life and save you money. Here are the essential maintenance tasks every car owner should know.', 3),
    
    ('GameDev', 'Getting Started with Game Development', 'Game development is more accessible than ever. This guide walks through the basics of creating your first simple game using free tools.', 4),
     ('MusicPro', 'Home Recording Studio Essentials', 'Setting up a home recording studio doesn''t have to break the bank. Here''s a guide to the essential equipment you need to start recording professional-quality audio at home.', 5),
    
    ('CyberSec', 'Cybersecurity Best Practices', 'In an increasingly connected world, protecting your digital life is crucial. Learn about essential security practices that everyone should implement to stay safe online.', 1),
    
    ('EcoWarrior', 'Sustainable Living on a Budget', 'Living sustainably doesn''t have to be expensive. This guide provides practical tips for reducing your environmental impact while saving money.', 2),
    
    ('PetWhisperer', 'Understanding Cat Behavior', 'Cats communicate in subtle ways. Learning to read their body language and understand their needs can help build a stronger bond with your feline friend.', 3),
    
    ('DIYMaster', 'Basic Home Repairs Everyone Should Know', 'Some home repairs don''t require a professional. Learn these basic maintenance skills to save money and become more self-reliant.', 4),
    
    ('StartupFounder', 'Lessons from My First Year in Business', 'Starting a business is a journey filled with unexpected challenges and valuable lessons. Here are the key insights from my first year as a founder.', 5),
    
    ('PhotoPro', 'Smartphone Photography Tips', 'You don''t need expensive equipment to take great photos. These techniques will help you make the most of your smartphone camera.', 1),
    
    ('MindfulLiving', 'Introduction to Meditation', 'Meditation doesn''t have to be complicated. Start with these simple techniques to build a daily mindfulness practice.', 2),
    
    ('CarEnthusiast', 'Basic Car Maintenance Guide', 'Regular maintenance can extend your car''s life and save you money. Here are the essential maintenance tasks every car owner should know.', 3),
    
    ('GameDev', 'Getting Started with Game Development', 'Game development is more accessible than ever. This guide walks through the basics of creating your first simple game using free tools.', 4), ('MusicPro', 'Home Recording Studio Essentials', 'Setting up a home recording studio doesn''t have to break the bank. Here''s a guide to the essential equipment you need to start recording professional-quality audio at home.', 5),
    
    ('CyberSec', 'Cybersecurity Best Practices', 'In an increasingly connected world, protecting your digital life is crucial. Learn about essential security practices that everyone should implement to stay safe online.', 1),
    
    ('EcoWarrior', 'Sustainable Living on a Budget', 'Living sustainably doesn''t have to be expensive. This guide provides practical tips for reducing your environmental impact while saving money.', 2),
    
    ('PetWhisperer', 'Understanding Cat Behavior', 'Cats communicate in subtle ways. Learning to read their body language and understand their needs can help build a stronger bond with your feline friend.', 3),
    
    ('DIYMaster', 'Basic Home Repairs Everyone Should Know', 'Some home repairs don''t require a professional. Learn these basic maintenance skills to save money and become more self-reliant.', 4),
    
    ('StartupFounder', 'Lessons from My First Year in Business', 'Starting a business is a journey filled with unexpected challenges and valuable lessons. Here are the key insights from my first year as a founder.', 5),
    
    ('PhotoPro', 'Smartphone Photography Tips', 'You don''t need expensive equipment to take great photos. These techniques will help you make the most of your smartphone camera.', 1),
    
    ('MindfulLiving', 'Introduction to Meditation', 'Meditation doesn''t have to be complicated. Start with these simple techniques to build a daily mindfulness practice.', 2),
    
    ('CarEnthusiast', 'Basic Car Maintenance Guide', 'Regular maintenance can extend your car''s life and save you money. Here are the essential maintenance tasks every car owner should know.', 3),
    
    ('GameDev', 'Getting Started with Game Development', 'Game development is more accessible than ever. This guide walks through the basics of creating your first simple game using free tools.', 4),
    
    ('LanguageLearner', 'Effective Language Learning Strategies', 'Learning a new language requires the right approach. These proven strategies will help you make consistent progress in your language learning journey.', 5);

-- -- Comments table - stores post comments
-- CREATE TABLE IF NOT EXISTS comments (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     post_id INTEGER NOT NULL,
--     user_id INTEGER NOT NULL,
--     content TEXT NOT NULL,
--     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
--     FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
-- );

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

