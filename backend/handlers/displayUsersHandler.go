package forum

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"real-time-forum/backend/authentication"
	modles "real-time-forum/backend/mods"
)

func selectUsers(db *sql.DB, r *http.Request) ([]modles.User, error) {
	user_id := authentication.IsLoged(db, r)
	query := `SELECT 
				u.id,
				u.nickname,
				u.firstname,
				u.lastname
			FROM users u
			WHERE u.id != ?`
	rows, err := db.Query(query, user_id)
	if err != nil {
		fmt.Println("error selecting from users:\n", err)
		return nil, err
	}
	defer rows.Close()

	var users []modles.User
	for rows.Next() {
		var user modles.User
		if err = rows.Scan(&user.ID, &user.Nickname, &user.FirstName, &user.LastName); err != nil {
			fmt.Printf("error scanning: %v\n", err)
			continue
		}
		users = append(users, user)
	}
	return users, nil
}

func DisplayUsersHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		users, err := selectUsers(db, r)
		if err != nil {
			http.Error(w, "Error fetching users", http.StatusInternalServerError)
			fmt.Println(err)
			return
		}
		w.Header().Set("Cache-Control", "no-cache")
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(users); err != nil {
			http.Error(w, "error encoding response", http.StatusInternalServerError)
		}
	}
}
