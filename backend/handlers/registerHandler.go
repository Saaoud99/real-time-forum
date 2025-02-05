package forum

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	authentication "real-time-forum/backend/authentication"
	modles "real-time-forum/backend/mods"

	"golang.org/x/crypto/bcrypt"
)

func RegisterHandler(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	var user modles.User
	json.NewDecoder(r.Body).Decode(&user)
	age, err := strconv.Atoi(user.Age)
	if err != nil {
		http.Error(w, "check age again", 400)
		return
	}
	if age < 18 {
		http.Error(w, "age must be more than 18", 400)
		fmt.Println("age must be more than 18", 400)
		return
	}
	if strings.TrimSpace(user.Nickname) == "" || strings.TrimSpace(user.Gender) == "" || strings.TrimSpace(user.FirstName) == "" || strings.TrimSpace(user.LastName)== "" || strings.TrimSpace(user.Email) == "" || strings.TrimSpace(user.Password) == "" {
		http.Error(w, "all fields shouldn't be empty or only white spaces", 400)
		fmt.Println("all fields must be filled", 400)
		return
	}
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	res, err := db.Exec("INSERT INTO users (nickname, age, gender, firstName, lastName, email, password) VALUES (?, ?, ?, ?, ?, ?, ?)",
		user.Nickname, age, user.Gender, user.FirstName, user.LastName, user.Email, string(hashedPassword))
	if err != nil {
		http.Error(w, "Error registering user", http.StatusInternalServerError)
		return
	}

	user_id, err := res.LastInsertId()
	if err != nil {
		fmt.Println(err)
		return
	}
	cookie := authentication.CookieMaker(w)
	err = authentication.InsretCookie(db, int(user_id), cookie, time.Now().Add(time.Hour*24))
	if err != nil {
		fmt.Println(err)
		return
	}

	w.Write([]byte("User registered successfully"))
	fmt.Println(user, "regis tered successfully")
}
