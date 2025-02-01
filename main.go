package main

import (
	"database/sql"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	forum "real-time-forum/backend"

	_ "github.com/mattn/go-sqlite3"
)

func initDB() *sql.DB {
	db, err := sql.Open("sqlite3", "./Test1.db")
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
	http.Handle("/frontend/css/", http.StripPrefix("/frontend/css/", http.FileServer(http.Dir("./frontend/css"))))
	http.Handle("/frontend/js/", http.StripPrefix("/frontend/js/", http.FileServer(http.Dir("./frontend/js"))))

	http.HandleFunc("/register", func(w http.ResponseWriter, r *http.Request) {
		forum.RegisterHandler(db, w, r)
	})
	fmt.Println("Server is running on http://localhost:1337")
	log.Fatal(http.ListenAndServe(":1337", nil))
}
