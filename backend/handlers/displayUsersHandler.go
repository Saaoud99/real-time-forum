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
	query := `   SELECT DISTINCT
            u.id,
            u.nickname,
            u.firstname,
            u.lastname
        FROM users u
        LEFT JOIN chat c ON (u.id = c.sender_id AND c.receiver_id = ?) 
            OR (u.id = c.receiver_id AND c.sender_id = ?)
        WHERE u.id != ?
        ORDER BY 
            CASE 
                WHEN c.sent_at IS NULL THEN 2
                ELSE 1 
            END,
            c.sent_at DESC,
            u.nickname COLLATE NOCASE
	`
	rows, err := db.Query(query, user_id, user_id, user_id)
	if err != nil {
		fmt.Println("error selecting from users:\n", err)
		return nil, err
	}
	defer rows.Close()

	var users []modles.User
	for rows.Next() {
		var user modles.User
		err = rows.Scan(
			&user.ID,
			&user.Nickname,
			&user.FirstName,
			&user.LastName,
		)
		if err != nil {
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
