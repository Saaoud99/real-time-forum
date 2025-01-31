package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	_ "github.com/mattn/go-sqlite3"
	"golang.org/x/crypto/bcrypt"
)

func initDB() *sql.DB {
	db, err := sql.Open("sqlite3", "./finalTest.db")
	if err != nil {
		log.Fatal("Error connecting to database:", err)
	}

	if err := db.Ping(); err != nil {
		log.Fatalf("Database connection error: %v", err)
	}

	scriptFile, err := os.Open("schema.sql")
	if err != nil {
		log.Fatalf("Failed to open SQL script file: %v", err)
	}
	defer scriptFile.Close()

	scriptContent, err := io.ReadAll(scriptFile)
	if err != nil {
		log.Fatalf("Failed to read SQL script file: %v", err)
	}
	_, err = db.Exec(string(scriptContent))
	if err != nil {
		log.Fatalf("Failed to execute SQL script: %v", err)
	}
	return db
}

func main() {
	db := initDB()
	defer db.Close()
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.Error(w, "page not found", 404)
			return
		}

		http.ServeFile(w, r, "./frontend/index.html")
	})
	http.HandleFunc("/register", func(w http.ResponseWriter, r *http.Request) {
		registerHandler(db, w, r)
	})
	http.Handle("/frontend/css/", http.StripPrefix("/frontend/css/", http.FileServer(http.Dir("./frontend/css"))))
	http.Handle("/frontend/js/", http.StripPrefix("/frontend/js/", http.FileServer(http.Dir("./frontend/js"))))

	fmt.Println("Server is running on http://localhost:3000")
	log.Fatal(http.ListenAndServe(":3000", nil))
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

func registerHandler(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	var user User
	json.NewDecoder(r.Body).Decode(&user)

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	_, err := db.Exec("INSERT INTO users (nickname, age, gender, firstName, lastName, email, password) VALUES (?, ?, ?, ?, ?, ?, ?)",
		user.Nickname, user.Age, user.Gender, user.FirstName, user.LastName, user.Email, string(hashedPassword))
	if err != nil {
		http.Error(w, "Error registering user", http.StatusInternalServerError)
		return
	}

	w.Write([]byte("User registered successfully"))
}
