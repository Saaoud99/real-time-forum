package modles

import (
	"time"
)

type LoginCredentials struct {
	Login    string `json:"login"`
	Password string `json:"password"`
}

type User struct {
	ID        int    `json:"Id"`
	Nickname  string `json:"Nickname"`
	Age       string `json:"Age"`
	Gender    string `json:"Gender"`
	FirstName string `json:"FirstName"`
	LastName  string `json:"LastName"`
	Email     string `json:"Email"`
	Password  string `json:"Password"`
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

type Message struct {
	Content      string    `json:"Content"`
	SenderID     int       `json:"Sender_id"`
	ReceiverID   int       `json:"Receiver_id"`
	ReceiverName string    `json:"Receiver_name"`
	SenderName   string    `json:"Sender_name"`
	Timestamp    time.Time `json:"Timestamp"`
}

type UserId struct {
	Val int `json:"Val"`
}

type StatusUpdate struct {
    UserID int    `json:"UserID"`
    Status string `json:"Status"`
}