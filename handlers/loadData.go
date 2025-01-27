package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	database "real-time-forum/DATABASE"
	"time"
)

var db *sql.DB

type Post struct {
	Id        int       `json:"id"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	UserId    int       `json:"user_id"`
	CreatedAt time.Time `json:"created_at"`
}

func GetPosts(w http.ResponseWriter, r *http.Request) {


	rows, err := database.DataBase.Query("SELECT * FROM posts")
	if err != nil {
		fmt.Println("ERRORO IN SELECTING", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var posts []Post
	for rows.Next() {
		var post Post
		err := rows.Scan(&post.Id, &post.Title, &post.Content, &post.UserId, &post.CreatedAt)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		posts = append(posts, post)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(posts)
}

func CreatePost(w http.ResponseWriter, r *http.Request) {

	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	var post Post
	err := json.NewDecoder(r.Body).Decode(&post)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if post.Title == "" || post.Content == "" || post.UserId == 0 {
		http.Error(w, "Title, content, and user ID are required", http.StatusBadRequest)
		return
	}

	err = database.DataBase.QueryRow(`
        INSERT INTO posts (title, content, user_id)
        VALUES ($1, $2, $3)
        RETURNING id, created_at`,
		post.Title, post.Content, post.UserId,
	).Scan(&post.Id, &post.CreatedAt)
	if err != nil {
		fmt.Println("Error in inserting posts", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(post)
}
