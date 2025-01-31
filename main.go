package main

import (
	"fmt"
	"net/http"
)

func main() {
	mux := http.NewServeMux()

	mux.Handle("/static/", http.StripPrefix("/js/", http.FileServer(http.Dir("frontend/js"))))
	mux.Handle("/css/", http.StripPrefix("/css/", http.FileServer(http.Dir("frontend/css"))))

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "frontend/index.html")
	})

	fmt.Println("listening on http://localhost:3000")
	if err := http.ListenAndServe(":3000", mux); err != nil {
		fmt.Println("Error starting server:", err)
	}
}
