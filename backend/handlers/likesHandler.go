package forum

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"real-time-forum/backend/authentication"
	modles "real-time-forum/backend/mods"
)

// HandleLikes manages HTTP requests for post/comment likes
// It handles both posts and comments through a single endpoint
// Bug: targetId is incorrectly set to like.User_Id initially instead of the actual target ID
func HandleLikes(db *sql.DB) http.HandlerFunc {
	fmt.Println("dkhl ########")
	// For POST requests:
	// - Validates user session via cookie
	// - Checks if like already exists
	// - If exists with same type (like/dislike) -> deletes it
	// - If exists with different type -> updates it
	// - If doesn't exist -> creates new like
	// Bug: Empty if statement for target=="post" condition

	// For GET requests:
	// - Returns like/dislike counts for a specific post/comment
	// - Requires active user session
	// - Returns counts in JSON format
	return func(w http.ResponseWriter, r *http.Request) {
		var like modles.Likes
		var err error
		target := "post"
		targetId := like.User_Id

		if like.CommentId != -1 {
			target = "comment"
			targetId = like.CommentId

		}
		switch r.Method {
		case http.MethodPost:
			{
				err := json.NewDecoder(r.Body).Decode(&like)
				if err != nil {
					http.Error(w, "Invalid JSON", http.StatusBadRequest)
					return
				}
				like.User_Id, err = authentication.ValidateCookie(db, w, r)
				if err != nil {
					http.Redirect(w, r, "/", http.StatusSeeOther)
					return
				}
				// countLikesForPost calculates total likes/dislikes for either a post or comment
				// Uses different SQL queries based on target type (post vs comment)
				// For posts, only counts likes where comment_id is -1
				// For comments, counts all likes for the specific comment_id
				like.LikeCOunt, err = countLikesForPost(db, like.Post_Id, like.CommentId, like.Type, target)
				if err != nil {
					http.Error(w, "Error counting likes", http.StatusInternalServerError)
					return
				}
				checkQuery := `SELECT EXISTS(SELECT 1 FROM likes WHERE post_id = ? AND comment_id = ? AND user_id = ?)`

				var exists bool
				err = db.QueryRow(checkQuery, like.Post_Id, like.CommentId, like.User_Id).Scan(&exists)
				if err != nil {
					http.Error(w, "Error checking like existence", http.StatusInternalServerError)
					return
				}

				if exists {
					LiketypeQuery := `SELECT TypeOfLike FROM likes WHERE post_id = ? AND comment_id = ? AND user_id = ?`
					var typea string
					db.QueryRow(LiketypeQuery, like.Post_Id, like.CommentId, like.User_Id).Scan(&typea)
					if typea == like.Type {
						query := `DELETE FROM likes WHERE post_id = ? AND comment_id = ? AND user_id = ?`
						_, err = db.Exec(query, like.Post_Id, like.CommentId, like.User_Id)
						if err != nil {
							http.Error(w, "Error deleting like", http.StatusInternalServerError)
							return
						}
					} else {
						Updatequery := `UPDATE likes SET TypeOfLike = ? WHERE post_id = ? AND comment_id = ? AND user_id = ?`
						_, err = db.Exec(Updatequery, like.Type, like.Post_Id, like.CommentId, like.User_Id)
						if err != nil {
							http.Error(w, "Error UPDATNG likeS", http.StatusInternalServerError)
							return
						}
					}
				} else {
					if target == "post" {
					}
					query := "INSERT INTO likes (user_id, post_id , comment_id , TypeOfLike) VALUES (?, ?, ?, ?)"
					_, err = db.Exec(query, like.User_Id, like.Post_Id, like.CommentId, like.Type)
					if err != nil {
						fmt.Println(err)
						http.Error(w, "Error adding like", http.StatusInternalServerError)
						return
					}
				}

			}
		case http.MethodGet:
			{
				if targetId != 0 {
					like.User_Id, err = authentication.ValidateCookie(db, w, r)
					if err != nil {
						http.Error(w, "No Active Session", http.StatusUnauthorized)
						return
					}
					like.LikeCOunt, err = countLikesForPost(db, like.Post_Id, like.CommentId, "like", target)
					if err != nil {
						http.Error(w, "Error Counting like", http.StatusInternalServerError)
						return
					}
					like.DislikeCOunt, err = countLikesForPost(db, like.Post_Id, like.CommentId, "dislike", target)
					if err != nil {
						http.Error(w, "Error Counting dislike", http.StatusInternalServerError)
						return
					}
					w.Header().Set("Content-Type", "application/json")
					json.NewEncoder(w).Encode(&like)
				}
			}

		default:
			{
				http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
				return
			}
		}
	}
}

// countLikesForPost calculates total likes/dislikes for either a post or comment
// Uses different SQL queries based on target type (post vs comment)
// For posts, only counts likes where comment_id is -1
// For comments, counts all likes for the specific comment_id
func countLikesForPost(db *sql.DB, postID int, CommentId int, liketype string, target string) (int, error) {
	fmt.Println("here daddy")
	var query string
	var likeCount int
	var err error
	if target == "comment" {
		query = `SELECT COUNT(*) FROM likes WHERE comment_id = ? AND TypeOfLike = ? `
		err = db.QueryRow(query, CommentId, liketype).Scan(&likeCount)
	} else if target == "post" {
		query = `SELECT COUNT(*) FROM likes WHERE post_id = ? AND TypeOfLike = ? AND comment_id == -1 `
		err = db.QueryRow(query, postID, liketype).Scan(&likeCount)
	}
	if err != nil {
		return 0, errors.New("error counting likes")
	}
	return likeCount, nil
}
