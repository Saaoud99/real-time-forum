package main

import (
	"fmt"
	"log"
	"net/http"
	database "real-time-forum/DATABASE"
	"real-time-forum/handlers"

	"github.com/gorilla/mux"
)

func main() {
	if err := database.InitDb(); err != nil {
		//fmt.Errorf("error ;", err)
		fmt.Println("error in data base", err)
		log.Fatalln(err)
	}

	defer database.DataBase.Close()

	router := mux.NewRouter()

	router.HandleFunc("/posts", handlers.GetPosts).Methods("GET")
	//router.HandleFunc("/posts", handlers.CreatePost).Methods("POST")

	http.Handle("/", router)
	http.ListenAndServe(":8080", nil)
}
