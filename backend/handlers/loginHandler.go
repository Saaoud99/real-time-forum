package forum

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"real-time-forum/backend/authentication"
	modles "real-time-forum/backend/mods"

	"golang.org/x/crypto/bcrypt"
)

func LoginHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
			return
		}

		var credentials modles.LoginCredentials

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
		err = db.QueryRow(query, login, login).Scan(&storedPassword, &user_id) // should i call it once or twice
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

		cookie := authentication.CookieMaker(w)
		err = authentication.InsretCookie(db, user_id, cookie, time.Now().Add(time.Hour*24))
		if err != nil {
			fmt.Println("error inserting cookie\n", err)
			return
		}
		fmt.Printf("%d logged in successfully!\n", user_id)
	}
}
