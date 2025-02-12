package authentication

import (
	"database/sql"
	"encoding/json"
	"net/http"
	modles "real-time-forum/backend/mods"
)

func HandleAuthentication(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var user_id modles.UserId
		user_id.Val = IsLoged(db, r)
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Cache-Control", "no-cache")
		if err := json.NewEncoder(w).Encode(user_id); err != nil {
			http.Error(w, "error encoding response", http.StatusInternalServerError)
		}
	}
}
