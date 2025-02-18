package database

const ( DummyPosts = `



INSERT INTO posts (nickname, title, content, user_id) VALUES
('AliceW', 'Latest Tech Trends', 'Discussing the latest advancements in AI and ML.', 1),
('BobM', 'Scientific Discoveries', 'New research in quantum physics.', 2),
('CharlieS', 'Football World Cup', 'Predictions for the upcoming World Cup.', 3),
('DianaJ', 'Tech Innovations', 'The impact of blockchain on finance.', 4),
('EveL', 'Space Exploration', 'NASAs upcoming Mars mission.', 5),
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

-- Sample direct messages between users with IDs 33 and others
INSERT INTO chat (content, sent_at, sender_id, receiver_id) VALUES
('Hey, how are you doing?', '2025-02-10 10:00:00', 33, 40),
('I am good, thanks! How about you?', '2025-02-10 10:05:00', 40, 33),
('Did you see the latest tech news?', '2025-02-10 10:10:00', 33, 41),
('Yes, it is incredible! AI is really evolving fast.', '2025-02-10 10:15:00', 41, 33),
('I cant wait for the next sports event.', '2025-02-10 10:20:00', 33, 42),
('Me neither, its going to be intense.', '2025-02-10 10:25:00', 42, 33),
('Are you coming to the game this weekend?', '2025-02-10 10:30:00', 40, 43),
('I will be there, excited!', '2025-02-10 10:35:00', 43, 40),
('Have you heard about the new scientific discovery?', '2025-02-10 10:40:00', 33, 44),
('Yes, its fascinating! The world is evolving fast.', '2025-02-10 10:45:00', 44, 33),
('I was thinking of buying a new phone.', '2025-02-10 10:50:00', 40, 45),
('Let me know which one you decide on, I need a new one too.', '2025-02-10 10:55:00', 45, 40),
('Hows the project going?', '2025-02-10 11:00:00', 33, 46),
('Its going well, were making great progress!', '2025-02-10 11:05:00', 46, 33),
('Im planning a trip abroad soon.', '2025-02-10 11:10:00', 40, 47),
('That sounds amazing! Let me know the details.', '2025-02-10 11:15:00', 47, 40),
('Do you think well have a chance to collaborate on the next project?', '2025-02-10 11:20:00', 33, 48),
('Definitely! Well have plenty of opportunities.', '2025-02-10 11:25:00', 48, 33);


` 
DummyAcounts = `
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
('JackR', 31, 'Male', 'Jack', 'Roberts', 'jack@example.com', 'admin123'),
('LiamH', 27, 'Male', 'Liam', 'Hall', 'liam@example.com', 'qwerty123'),
('MiaG', 29, 'Female', 'Mia', 'Green', 'mia@example.com', 'password321'),
('NoahB', 34, 'Male', 'Noah', 'Brown', 'noah@example.com', 'iloveyou'),
('OliviaW', 33, 'Female', 'Olivia', 'White', 'olivia@example.com', '123qwe'),
('PaulT', 26, 'Male', 'Paul', 'Taylor', 'paul@example.com', 'password1234'),
('QuinnF', 32, 'Female', 'Quinn', 'Foster', 'quinn@example.com', 'supersecure'),
('RyanM', 28, 'Male', 'Ryan', 'Moore', 'ryan@example.com', 'letmein123'),
('SophiaK', 25, 'Female', 'Sophia', 'King', 'sophia@example.com', 'sunshine'),
('ThomasL', 30, 'Male', 'Thomas', 'Lee', 'thomas@example.com', '12345678'),
('UrsulaP', 34, 'Female', 'Ursula', 'Perry', 'ursula@example.com', 'strongpassword'),
('VictorJ', 29, 'Male', 'Victor', 'Jones', 'victor@example.com', 'password987'),
('WendyD', 31, 'Female', 'Wendy', 'Davis', 'wendy@example.com', 'hello123'),
('XanderC', 27, 'Male', 'Xander', 'Collins', 'xander@example.com', 'test1234'),
('YaraS', 26, 'Female', 'Yara', 'Stewart', 'yara@example.com', 'mysecurepassword'),
('ZacharyR', 33, 'Male', 'Zachary', 'Robinson', 'zachary@example.com', 'newpassword'),
('AidenV', 24, 'Male', 'Aiden', 'Vargas', 'aiden@example.com', 'qwerty789'),
('BellaM', 29, 'Female', 'Bella', 'Martinez', 'bella@example.com', 'mypassword123'),
('CameronF', 31, 'Male', 'Cameron', 'Fletcher', 'cameron@example.com', 'secretpass'),
('DaisyG', 28, 'Female', 'Daisy', 'Garcia', 'daisy@example.com', 'flowerpower'),
('EthanW', 30, 'Male', 'Ethan', 'Williams', 'ethan@example.com', 'letmein4'),
('FionaH', 27, 'Female', 'Fiona', 'Harris', 'fiona@example.com', 'securepass123');

`
)