package forum

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"real-time-forum/backend/authentication"
	modles "real-time-forum/backend/mods"
)

func CreateComment(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID, authenticated := authentication.ValidateCookie(db, w, r)
		if authenticated != nil {
			http.Error(w, authenticated.Error(), http.StatusUnauthorized)
			return
		}

		var comment modles.Comment

		err := json.NewDecoder(r.Body).Decode(&comment)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		stmt, err := db.Prepare("INSERT INTO comments(post_id, user_id, content, created_at) VALUES(?, ?, ?, ?)")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer stmt.Close()

		comment.UserID = userID

		if comment.Content == "" {
			http.Error(w, "Need to add a comment", http.StatusBadRequest)
			return
		}

		_, err = stmt.Exec(comment.PostID, comment.UserID, comment.Content, time.Now())
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
	}
}

func GetComments(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		postID := r.URL.Query().Get("post_id")
		fmt.Println("zbi hna ", postID)
		query := `SELECT  com.post_id, com.id, com.user_id, us.nickname, com.content, com.created_at FROM comments com
            JOIN users us ON com.user_id = us.id
            WHERE com.post_id = ?
            ORDER BY com.created_at ASC
        `
		rows, err := db.Query(query, postID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var comments []modles.Comment
		for rows.Next() {
			var comment modles.Comment
			err := rows.Scan(&comment.PostID, &comment.ID, &comment.UserID, &comment.UserName, &comment.Content, &comment.CreatedAt)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			comment.Likes, err = countLikesForPost(db, comment.PostID, comment.ID, "like", "comment")
			if err != nil {
				http.Error(w, "Error Counting likes", http.StatusInternalServerError)
				return
			}
			comment.Dislikes, err = countLikesForPost(db, comment.PostID, comment.ID, "dislike", "comment")
			if err != nil {
				http.Error(w, "Error Counting dislikes", http.StatusInternalServerError)
				return
			}
			comments = append(comments, comment)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(comments)
	}
}
