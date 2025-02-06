package forum

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	modles "real-time-forum/backend/mods"
)

func NewPostHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var Post modles.NewPost
		json.NewDecoder(r.Body).Decode(&Post)

		cookie, err := r.Cookie("forum_session")
		if err != nil {
			http.Error(w, "Unauthorized to create a post", http.StatusUnauthorized)
			return
		}
		var useriD int
		err = db.QueryRow(`SELECT user_id FROM sesions WHERE sesion= ?;`, cookie.Value).Scan(&useriD)
		if err != nil {
			fmt.Println("error selecting from sessions table", err)
			return
		}
		var userName string
		err = db.QueryRow(`SELECT nickname FROM users WHERE id= ?`, useriD).Scan(&userName)
		if err != nil {
			fmt.Println("error selecting from users table", err)
			return
		}

		title, content, categories := Post.Title, Post.Content, Post.Categories
		if strings.TrimSpace(title) == "" || len(categories) == 0 || strings.TrimSpace(content) == "" {
			http.Error(w, "All fields are required", http.StatusBadRequest)
			return
		}
		if len(title) > 50 || len(content) > 1000 {
			http.Error(w, "title leght or content lenght exceeded", http.StatusBadRequest)
			return
		}

		tx, err := db.Begin()
		if err != nil {
			log.Fatal(err)
		}
		defer tx.Rollback()
		// inserting into posts
		result, err := tx.Exec(
			"INSERT INTO posts (nickname, title, content, user_id) VALUES (?, ?, ?,?)",
			userName, title, content, useriD)
		if err != nil {
			http.Error(w, "error creating post", 500)
			return
		}
		postID, err := result.LastInsertId()
		if err != nil {
			return
		}
		for _, category := range categories {
			if category != "tech" && category != "science" && category != "sport" {
				http.Error(w, "bad request", http.StatusBadRequest)
				return
			}
			_, err = tx.Exec("INSERT INTO categories (post_id, categories) VALUES (?, ?)", postID, category)
			if err != nil {
				return
			}
		}
		if err := tx.Commit(); err != nil {
			http.Error(w, "Error committing transaction", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)
	}
}
