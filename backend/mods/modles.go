package modles

import "time"

type LoginCredentials struct {
	Login    string `json:"login"`
	Password string `json:"password"`
}

type User struct {
	ID        int    `json:"id"`
	Nickname  string `json:"nickname"`
	Age       string `json:"age"`
	Gender    string `json:"gender"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
	Password  string `json:"password"`
}

type NewPost struct {
	Title      string   `json:"title"`
	Content    string   `json:"content"`
	Categories []string `json:"categories"`
}

type Post struct {
	ID         int      `json:"Id"`
	UserName   string   `json:"Username"`
	Title      string   `json:"Title"`
	Content    string   `json:"Content"`
	Categories []string `json:"Categories"`
	CreatedAt  string   `json:"Created_at"`
	Likes      int      `json:"Likes"`
	Dislikes   int      `json:"Dislikes"`
}

type Comment struct {
	ID        int       `json:"id"`
	PostID    int       `json:"post_id"`
	UserName  string    `json:"username"`
	UserID    int       `json:"user_id"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
}

/*type Likes struct {
	User_Id      int    `json:"UserId"`
	Post_Id      int    `json:"PostId"`
	LikeCOunt    int    `json:"LikeCOunt"`
	DislikeCOunt int    `json:"DislikeCOunt"`
	CommentId    int    `json:"CommentId"`
	Type         string `json:"Type"`
}*/

// CREATE TABLE IF NOT EXISTS chat (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     content TEXT NOT NULL,
//     sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     sender_id INTEGER NOT NULL,
//     receiver_id INTEGER NOT NULL,
//     FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE,
//     FOREIGN KEY (receiver_id) REFERENCES users (id) ON DELETE CASCADE
// );

type Message struct {
	ID          int       `json:"Id"`
	Content     string    `json:"Content"`
	Sender_id   int       `json:"Sender_id"`
	Receiver_id int       `json:"Receiver_id"`
	Sent_at     time.Time `json:"Sent_at"`
}
