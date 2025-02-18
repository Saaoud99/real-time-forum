package websoc

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"real-time-forum/backend/authentication"
	modles "real-time-forum/backend/mods"
)

func fetchChat(db *sql.DB, senedr int, reciever int) ([]modles.Message, error) {
	query := `
		SELECT 
			ch.content,
			ch.sent_at,
			ch.sender_id,
			ch.receiver_id,
			s.nickname AS senderName,
			r.nickname AS receiverName
		FROM chat ch
		JOIN users s ON ch.sender_id = s.id
		JOIN users r ON ch.receiver_id = r.id
		WHERE (ch.sender_id = ? AND ch.receiver_id = ?) 
		   OR (ch.sender_id = ? AND ch.receiver_id = ?)
		ORDER BY ch.sent_at DESC;
	`
	rows, err := db.Query(query, senedr, reciever, reciever, senedr)
	if err != nil {
		return nil, fmt.Errorf("query error: %v", err)
	}
	defer rows.Close()

	var chat []modles.Message
	for rows.Next() {
		var msg modles.Message
		err = rows.Scan(
			&msg.Content,
			&msg.Timestamp,
			&msg.SenderID,
			&msg.ReceiverID,
			&msg.SenderName,
			&msg.ReceiverName,
		)
		if err != nil {
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
		userId := authentication.IsLoged(db, r)
		if userId == 0 {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}
		receiverNickname := r.URL.Query().Get("receiver")
		if receiverNickname == "" {
			http.Error(w, "receiver not specified", http.StatusBadRequest)
			return
		}
		var reciever_id int
		err := db.QueryRow(`SELECT id FROM users WHERE nickname = ?`, receiverNickname).Scan(&reciever_id)
		if err != nil {
			fmt.Println("error selecting from users:", err)
			return
		}

		chat, err := fetchChat(db, userId, reciever_id)
		if err != nil {
			fmt.Println(err)
			http.Error(w, "error fetching chat", 500)
			return
		}
		w.Header().Set("Cache-Control", "no-cache")
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(chat); err != nil {
			http.Error(w, "error encoding response", http.StatusInternalServerError)
		}

	}
}
