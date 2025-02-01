package forum

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
