package forum

import (
	"database/sql"
	"fmt"
	"net/http"
)

func LogOutHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
			return
		}

		cookie, err := r.Cookie("forum_session")
		if err != nil {
			http.Error(w, "No active session found", http.StatusUnauthorized)
			return
		}

		sessionID := cookie.Value
		query := `DELETE FROM sesions WHERE sesion = ?` /*this is not a typo, sessions didn't work for some reason*/
		_, err = db.Exec(query, sessionID)
		if err != nil {
			fmt.Println("error executing the query")
		}

		http.SetCookie(w, &http.Cookie{
			Name:   "forum_session",
			Value:  "",
			Path:   "/",
			MaxAge: -1,
		})
	}
}
