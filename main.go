package main

import (
	"fmt"
	"log"
	"net/http"

	forum "real-time-forum/backend"
	"real-time-forum/database"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	db := database.InitDB()
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

	http.HandleFunc("/posts", func(w http.ResponseWriter, r *http.Request) {
		forum.APIHandler(db)(w, r)
	})

	http.HandleFunc("/register", func(w http.ResponseWriter, r *http.Request) {
		forum.RegisterHandler(db, w, r)
	})
	http.HandleFunc("/newPost", func(w http.ResponseWriter, r *http.Request) {
		forum.NewPostHandler(db)(w, r)
	})

	http.HandleFunc("/logout", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			forum.LogOutHandler(db)(w, r)
		} else {
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		}
	})

	http.HandleFunc("/login",func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			forum.LoginHandler(db)(w,r)
		}else {
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		}
	})

	// http.HandleFunc("/comments", func(w http.ResponseWriter, r *http.Request) {
	// 	fmt.Println("kkkkkkkkkkk")
	// 	if r.Method == http.MethodPost{
	// 		forum.CreateComment(db)(w,r)
	// 	} else if r.Method == http.MethodGet{
	// 		forum.GetComments(db)(w,r)
	// 	} else {
	// 		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
	// 	}
	// })

	fmt.Println("Server is running on http://localhost:4011")
	log.Fatal(http.ListenAndServe(":4011", nil))
}
