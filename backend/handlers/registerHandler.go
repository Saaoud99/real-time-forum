package forum

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
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
	fmt.Println("age :", user.Age)
	 age, err := strconv.Atoi(user.Age); if err != nil {
		http.Error(w, "check age again", 400)
		return
	}
	if age < 18 {
		http.Error(w, "age must be more than 18", 400)
		fmt.Println("age must be more than 18", 400)
		return
	}
	if user.Nickname == "" || user.Gender == "" || user.FirstName == "" || user.LastName == "" || user.Email == "" || user.Password == "" {
		http.Error(w, "bad request ", 400)
		fmt.Println("bad request ", 400)
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
