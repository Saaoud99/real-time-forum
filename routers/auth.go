package routers

import (
	"net/http"

	"real-time-forum/handlers"
	"real-time-forum/handlers/auth"
)

// Setup Auth Routes
func SetupAuthRoutes() *http.ServeMux {
	mux := http.NewServeMux()

	mux.HandleFunc("/auth/", func(w http.ResponseWriter, r *http.Request) {
		handlers.ErrorHandler(w, r, http.StatusNotFound)
	})

	mux.HandleFunc("/auth/register", auth.RegisterUser)
	mux.HandleFunc("/auth/login", auth.LoginUser)
	mux.HandleFunc("/auth/logout", auth.LogoutUser)

	return mux
}
