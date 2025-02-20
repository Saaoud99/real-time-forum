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
		//fmt.Errorf("error ;", err)
		//fmt.Println("error in data base", err)
		log.Fatalln(err)
	}
	mux := http.NewServeMux()
	defer database.DataBase.Close()

	mux.HandleFunc("/", api.HomeHandler)
	mux.HandleFunc("/posts", api.GetPosts)
	mux.HandleFunc("/controlers/login.js", api.ServeJs)

	if err := http.ListenAndServe(":8080", mux); err != nil {
		fmt.Println("Error starting server:", err)
	}
}
