package main

import (
	"fmt"
	"log"
	"net/http"
	database "real-time-forum/DATABASE"
	"real-time-forum/handlers/api"
)

func main() {
	if err := database.InitDb(); err != nil {
		log.Fatalln(err)
	}
	mux := http.NewServeMux()
	defer database.DataBase.Close()

	mux.HandleFunc("/", handlers.HomeHandler)
	mux.HandleFunc("/posts", handlers.GetPosts)
	

	if err := http.ListenAndServe(":8080", mux); err != nil {
		fmt.Println("Error starting server:", err)
	}
}
