package database

import (
	"database/sql"
	"fmt"
	"io"
	"log"
	"os"
)

func InitDB() *sql.DB {
	db, err := sql.Open("sqlite3", "./database/Test24.db")
	if err != nil {
		log.Fatal("Error connecting to database:", err)
	}

	if err := db.Ping(); err != nil {
		log.Fatalf("Database connection error: %v", err)
	}

	scriptFile, err := os.Open("database/schema.sql")
	if err != nil {
		log.Fatalf("Failed to open SQL script file: %v", err)
	}
	defer scriptFile.Close()

	scriptContent, err := io.ReadAll(scriptFile)
	if err != nil {
		log.Fatalf("Failed to read SQL script file: %v", err)
	}
	res, err := db.Exec(string(scriptContent))
	r, _ := res.RowsAffected()
	fmt.Println("res",r)
	if err != nil {
		log.Fatalf("Failed to execute SQL script: %v", err)
	}
	return db
}
