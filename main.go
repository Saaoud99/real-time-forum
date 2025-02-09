package main

import (
	"fmt"
	"log"
	"net/http"

	forum "real-time-forum/backend/handlers"
	"real-time-forum/database"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	mux := http.NewServeMux()
	db := database.InitDB()
	defer db.Close()

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.Error(w, "page not found", 404)
			return
		}

		http.ServeFile(w, r, "./frontend/index.html")
	})

	mux.Handle("/frontend/", http.StripPrefix("/frontend/", http.FileServer(http.Dir("./frontend"))))

	mux.HandleFunc("/posts", func(w http.ResponseWriter, r *http.Request) {
		forum.APIHandler(db)(w, r)
	})

	// handle method not allowed later
	mux.HandleFunc("/register", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			forum.RegisterHandler(db, w, r)
		} else {
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		}
	})

	mux.HandleFunc("/newPost", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			forum.NewPostHandler(db)(w, r)
		} else {
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		}
	})

	mux.HandleFunc("/logout", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			forum.LogOutHandler(db)(w, r)
		} else {
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		}
	})

	mux.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			forum.LoginHandler(db)(w, r)
		} else {
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		}
	})

	mux.HandleFunc("/comments", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			fmt.Println("post here")
			forum.CreateComment(db)(w, r)
		} else if r.Method == http.MethodGet {
			fmt.Println("get here")
			forum.GetComments(db)(w, r)
		} else {
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		}
	})

	// mux.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
	// 	print("dkhl main soc \n")
	// 	websoc.HandleConnections(db, w, r)
	// })

	// displaying users
	mux.HandleFunc("/users", func(w http.ResponseWriter, r *http.Request) {
		forum.DisplayUsersHandler(db)(w,r)
	})

	/*http.HandleFunc("/like", forum.HandleLikes(db))*/

	fmt.Println("Server is running on http://localhost:4011")
	log.Fatal(http.ListenAndServe(":4011", mux))
}
