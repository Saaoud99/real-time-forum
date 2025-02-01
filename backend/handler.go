package forum

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"golang.org/x/crypto/bcrypt"
)

func RegisterHandler(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	var user User
	json.NewDecoder(r.Body).Decode(&user)
	if user.Nickname == "" || user.Age == "" || user.Gender == "" || user.FirstName == "" || user.LastName == "" || user.Email == "" || user.Password == "" {
		http.Error(w, "bad request ", 400)
		fmt.Println("bad request ", 400)
		return
	}
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	res, err := db.Exec("INSERT INTO users (nickname, age, gender, firstName, lastName, email, password) VALUES (?, ?, ?, ?, ?, ?, ?)",
		user.Nickname, user.Age, user.Gender, user.FirstName, user.LastName, user.Email, string(hashedPassword))
	if err != nil {
		http.Error(w, "Error registering user", http.StatusInternalServerError)
		return
	}

	user_id, err := res.LastInsertId()
	if err != nil {
		fmt.Println(err)
		return
	}
	cookie := CookieMaker(w)
	err = InsretCookie(db, int(user_id), cookie, time.Now().Add(time.Hour*24))
	if err != nil {
		fmt.Println(err)
		return
	}

	w.Write([]byte("User registered successfully"))
	fmt.Println(user, "regis tered successfully")
}

type NewPost struct {
	Title      string   `json:"title"`
	Content    string   `json:"content"`
	Categories []string `json:"categories"`
}

func NewPostHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var Post NewPost
		json.NewDecoder(r.Body).Decode(&Post)

		cookie, err := r.Cookie("forum_session")
		if err != nil {
			http.Error(w, "Unauthorized to create a post", http.StatusUnauthorized)
			return
		}
		var useriD int
		err = db.QueryRow(`SELECT user_id FROM sesions WHERE sesion= ?;`, cookie.Value).Scan(&useriD)
		if err != nil {
			fmt.Println(err)
			return
		}
		var userName string
		err = db.QueryRow(`SELECT nickname FROM users WHERE id= ?`, useriD).Scan(&userName)
		if err != nil {
			fmt.Println(err)
			return
		}

		title := Post.Title
		content := Post.Content
		categories := Post.Categories
		if title == "" || len(categories) == 0 || content == "" {
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
			fmt.Println(userName, title, content, useriD)
		if err != nil {
			http.Error(w, "error creating post", 500)
			return
		}
		postID, err := result.LastInsertId()
		if err != nil {
			return
		}
		for _, category := range categories {
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
