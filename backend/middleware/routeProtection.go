package middleware

import (
	"context"
	"database/sql"
	"net/http"
	"real-time-forum/backend/authentication"
)

type contextKey string

const userIDKey = contextKey("userID")

// AuthMiddleware wraps an http.Handler and checks if the user is logged in.
func AuthMiddleware(db *sql.DB, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		userID := authentication.IsLoged(db, r)
		if userID == 0 {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		// Add userID to the context so downstream handlers can access it.
		ctx := context.WithValue(r.Context(), userIDKey, userID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
