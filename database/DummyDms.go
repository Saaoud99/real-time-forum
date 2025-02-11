package database

const DummyDms = `
			INSERT INTO chat (content, sent_at, sender_id, receiver_id) VALUES
			('Hey, how are you doing?', '2025-02-10 10:00:00', 1, 2),
			('I am good, thanks! How about you?', '2025-02-10 10:05:00', 2, 1),
			('Did you see the latest tech news?', '2025-02-10 10:10:00', 1, 2),
			('Yes, it is incredible! AI is really evolving fast.', '2025-02-10 10:15:00', 2, 1),
			('I cant wait for the next sports event.', '2025-02-10 10:20:00', 1, 2),
			('Me neither, its going to be intense.', '2025-02-10 10:25:00', 2, 1),
			('Are you coming to the game this weekend?', '2025-02-10 10:30:00', 1, 2),
			('I will be there, excited!', '2025-02-10 10:35:00', 2, 1),
			('Have you heard about the new scientific discovery?', '2025-02-10 10:40:00', 1, 2),
			('Yes, its fascinating! The world is evolving fast.', '2025-02-10 10:45:00', 2, 1),
			('I was thinking of buying a new phone.', '2025-02-10 10:50:00', 1, 2),
			('Let me know which one you decide on, I need a new one too.', '2025-02-10 10:55:00', 2, 1),
			('Hows the project going?', '2025-02-10 11:00:00', 1, 2),
			('Its going well, were making great progress!', '2025-02-10 11:05:00', 2, 1),
			('Im planning a trip abroad soon.', '2025-02-10 11:10:00', 1, 2),
			('That sounds amazing! Let me know the details.', '2025-02-10 11:15:00', 2, 1),
			('Do you think well have a chance to collaborate on the next project?', '2025-02-10 11:20:00', 1, 2),
			('Definitely! Well have plenty of opportunities.', '2025-02-10 11:25:00', 2, 1);
	
`