package handlers

import (
	"html/template"
	"net/http"
)

// HomeHandler it handles requests to home page "/"
// execute the home page and show it to the user
func HomeHandler(w http.ResponseWriter, r *http.Request) {
	tmp, err := template.ParseFiles("web/templates/index.html")
	if err != nil {
		// ErrorHandler(w, r, http.StatusInternalServerError)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	tmp.Execute(w, nil)
}

// // RegisterHandler it handles requests to register page "/register"
// // parse the register page and show it to the user
// func RegisterHandler(w http.ResponseWriter, r *http.Request) {
// 	if r.Method != http.MethodGet {
// 		ErrorHandler(w, r, http.StatusMethodNotAllowed)
// 		return
// 	}

// 	if err := templates.ExecuteTemplate(w, "register.html", nil); err != nil {
// 		ErrorHandler(w, r, http.StatusInternalServerError)
// 		return
// 	}
// }

// // RegisterHandler it handles requests to login page "/login"
// // parse the login page and show it to the user
// func LoginHandler(w http.ResponseWriter, r *http.Request) {
// 	if r.Method != http.MethodGet {
// 		ErrorHandler(w, r, http.StatusMethodNotAllowed)
// 		return
// 	}

	
// }
