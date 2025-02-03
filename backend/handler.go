package forum

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
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

func FetchPosts(db *sql.DB) ([]Post, error) {
	baseQuery := `
        SELECT 
            p.id,
            p.nickname,
            p.title,
            p.content,
            COALESCE(GROUP_CONCAT(c.categories, ','), '') AS categories,
            p.created_at
        FROM posts p
        LEFT JOIN categories c ON c.post_id = p.id
    `

	query := baseQuery + `
        GROUP BY p.id
        ORDER BY p.created_at DESC
    `

	rows, err := db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("query error: %v", err)
	}
	defer rows.Close()

	var posts []Post
	for rows.Next() {
		var post Post
		var categoryString string
		err := rows.Scan(&post.ID, &post.UserName, &post.Title, &post.Content, &categoryString, &post.CreatedAt)
		if err != nil {
			fmt.Printf("error scanning: %v\n", err)
			continue
		}
		if categoryString != "" {
			post.Categories = splitStringByComma(categoryString)
		} else {
			post.Categories = []string{}
		}
		posts = append(posts, post)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("row iteration error: %v", err)
	}

	return posts, nil
}

func splitStringByComma(input string) []string {
	if input == "" {
		return []string{}
	}
	return strings.Split(input, ",")
}

// APIHandler serves the posts as JSON
func APIHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		posts, err := FetchPosts(db)
		if err != nil {
			http.Error(w, "Error fetching posts", http.StatusInternalServerError)
			fmt.Println(err)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		/* this line sets an HTTP response header to control how the response
		is cached by clients (browsers) and intermediate caches (proxies).*/
		w.Header().Set("Cache-Control", "no-cache")
		if err := json.NewEncoder(w).Encode(posts); err != nil {
			http.Error(w, "error encoding response", http.StatusInternalServerError)
		}
	}
}

type LoginCredentials struct {
	Login    string `json:"login"`
	Password string `json:"password"`
}

func LoginHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
			return
		}

		var credentials LoginCredentials

		err := json.NewDecoder(r.Body).Decode(&credentials)
		if err != nil {
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}
		login := credentials.Login
		password := credentials.Password

		if login == "" || password == "" {
			http.Error(w, "please enter your login and password", http.StatusBadRequest)
			return
		}
		var storedPassword string
		var user_id int
		query := "SELECT password, id FROM users WHERE email = ? OR nickname = ?"
		err = db.QueryRow(query, login , login).Scan(&storedPassword, &user_id) // should i call it once or twice
		if err != nil {
			if err == sql.ErrNoRows {
				http.Error(w, "User not found", http.StatusUnauthorized)
			} else {
				http.Error(w, "Database error", http.StatusInternalServerError)
			}
			return
		}

		err2 := bcrypt.CompareHashAndPassword([]byte(storedPassword), []byte(password))
		if err2 != nil {
			http.Error(w, "Invalid credentials", http.StatusUnauthorized)
			return
		}

		// deleting old session
		deleteQuery := "DELETE FROM sesions WHERE user_id = ?"
		_, err = db.Exec(deleteQuery, user_id)
		if err != nil {
			http.Error(w, "Error cleaning old sessions", http.StatusInternalServerError)
			return
		}

		cookie := CookieMaker(w)
		err = InsretCookie(db, user_id, cookie, time.Now().Add(time.Hour*24))
		if err != nil {
			fmt.Println("error inserting cookie\n", err)
			return
		}
		fmt.Printf("%d logged in successfully!\n", user_id)
	}
}

func LogOutHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
			return
		}

		cookie, err := r.Cookie("forum_session")
		if err != nil {
			http.Error(w, "No active session found", http.StatusUnauthorized)
			return
		}

		sessionID := cookie.Value
		query := `DELETE FROM sesions WHERE sesion = ?` /*this is not a typo, sessions didn't work for some reason*/
		_, err = db.Exec(query, sessionID)
		if err != nil {
			fmt.Println("error executing the query")
		}

		http.SetCookie(w, &http.Cookie{
			Name:   "forum_session",
			Value:  "",
			Path:   "/",
			MaxAge: -1,
		})
		fmt.Println(sessionID, "loged out")
	}
}
