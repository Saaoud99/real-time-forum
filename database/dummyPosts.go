package database

const DummyPosts = `

INSERT INTO users (nickname, age, gender, firstName, lastName, email, password) VALUES
('AliceW', 25, 'Female', 'Alice', 'Walker', 'alice@example.com', 'password123'),
('BobM', 30, 'Male', 'Bob', 'Miller', 'bob@example.com', 'securepass'),
('CharlieS', 28, 'Male', 'Charlie', 'Smith', 'charlie@example.com', 'pass123'),
('DianaJ', 26, 'Female', 'Diana', 'Johnson', 'diana@example.com', 'qwerty'),
('EveL', 32, 'Female', 'Eve', 'Lewis', 'eve@example.com', 'letmein'),
('FrankB', 35, 'Male', 'Frank', 'Brown', 'frank@example.com', 'hunter2'),
('GraceD', 27, 'Female', 'Grace', 'Davis', 'grace@example.com', '123456'),
('HenryC', 29, 'Male', 'Henry', 'Clark', 'henry@example.com', 'abcdef'),
('IvyP', 24, 'Female', 'Ivy', 'Parker', 'ivy@example.com', 'mypassword'),
('JackR', 31, 'Male', 'Jack', 'Roberts', 'jack@example.com', 'admin123');


INSERT INTO posts (nickname, title, content, user_id) VALUES
('AliceW', 'Latest Tech Trends', 'Discussing the latest advancements in AI and ML.', 1),
('BobM', 'Scientific Discoveries', 'New research in quantum physics.', 2),
('CharlieS', 'Football World Cup', 'Predictions for the upcoming World Cup.', 3),
('DianaJ', 'Tech Innovations', 'The impact of blockchain on finance.', 4),
('EveL', 'Space Exploration', 'NASA’s upcoming Mars mission.', 5),
('FrankB', 'Basketball Tactics', 'How to improve defensive strategies.', 6),
('GraceD', 'Cybersecurity Tips', 'Best practices to keep your data safe.', 7),
('HenryC', 'Health and Science', 'The effects of sleep on brain function.', 8),
('IvyP', 'Tennis Grand Slam', 'Analyzing top players this season.', 9),
('JackR', 'AI in Sports', 'How AI is revolutionizing athlete training.', 10);


INSERT INTO categories (post_id, categories) VALUES
(1, 'tech'),
(2, 'science'),
(3, 'sport'),
(4, 'tech'),
(5, 'science'),
(6, 'sport'),
(7, 'tech'),
(8, 'science'),
(9, 'sport'),
(10, 'tech');


INSERT INTO comments (post_id, user_id, content) VALUES
(1, 2, 'AI is evolving rapidly!'),
(2, 3, 'Quantum physics is mind-blowing.'),
(3, 4, 'I think Brazil has a strong chance.'),
(4, 5, 'Blockchain is the future of transactions.'),
(5, 6, 'Mars colonization is a huge challenge.'),
(6, 7, 'Defense wins championships!'),
(7, 8, 'Cybersecurity is critical nowadays.'),
(8, 9, 'Good sleep is underrated!'),
(9, 10, 'Tennis has become more competitive.'),
(10, 1, 'AI-driven training is fascinating.');

`