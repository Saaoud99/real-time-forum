package websoc

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"real-time-forum/backend/authentication"
	modles "real-time-forum/backend/mods"
)

func fetchChat(db *sql.DB) ([]modles.WebSocketMessage, error) {
	query := `
			SELECT 
				ch.content,
				ch.sent_at,
				ch.sender_id,
				ch.receiver_id
			FROM chat ch
			ORDER BY ch.sent_at DESC;
	`
	rows, err := db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("query error: %v", err)
	}
	defer rows.Close()

	var chat []modles.WebSocketMessage
	for rows.Next() {
		var msg modles.WebSocketMessage
		if err = rows.Scan(&msg.Content, &msg.Timestamp, &msg.SenderID, &msg.ReceiverID); err != nil {
			fmt.Printf("error scanning: %v\n", err)
			continue
		}
		chat = append(chat, msg)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("row iteration error: %v", err)
	}
	return chat, nil
}

func ChatAPIHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if userId := authentication.IsLoged(db, r); userId != 0 {
			chat, err := fetchChat(db)
			if err != nil {
				fmt.Println(err)
				http.Error(w, "error fetching chat", 500)
				return
			}
			w.Header().Set("Content-Type", "application/json")
			if err := json.NewEncoder(w).Encode(chat); err != nil {
				http.Error(w, "error encoding response", http.StatusInternalServerError)
			}
		}
	}
}
