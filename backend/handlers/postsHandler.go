package forum

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"real-time-forum/backend/authentication"
	modles "real-time-forum/backend/mods"
)

func FetchPosts(db *sql.DB, category string) ([]modles.Post, error) {
	var rows *sql.Rows
	var err error
	query := `
				SELECT 
				    p.id,
				    p.nickname,
				    p.title,
				    p.content,
				    COALESCE(GROUP_CONCAT(c.categories, ','), '') AS categories,
				    p.created_at
				FROM posts p
				LEFT JOIN categories c ON c.post_id = p.id
				GROUP BY p.id, p.nickname, p.title, p.content, p.created_at
				ORDER BY p.created_at DESC;
			`

	rows, err = db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("query error: %v", err)
	}
	defer rows.Close()

	var posts []modles.Post
	for rows.Next() {
		var post modles.Post
		var categoryString string
		err := rows.Scan(&post.ID, &post.UserName, &post.Title, &post.Content, &categoryString, &post.CreatedAt,)
		if err != nil {
			fmt.Printf("error scanning: %v\n", err)
			continue
		}
		if categoryString != "" {
			post.Categories = splitStringByComma(categoryString)
		} else {
			post.Categories = []string{}
		}
		posts = append(posts, post)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("row iteration error: %v", err)
	}

	return posts, nil
}

func splitStringByComma(input string) []string {
	if input == "" {
		return []string{}
	}
	return strings.Split(input, ",")
}

func APIHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		category := r.URL.Query().Get("category")
		posts, err := FetchPosts(db, category)
		/*add this to hid login and register if the user alredy loged*/
		user_id := authentication.IsLoged(db, r)
		fmt.Println("user id :", user_id)
		if err != nil {
			http.Error(w, "Error fetching posts", http.StatusInternalServerError)
			fmt.Println(err)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		/* this line sets an HTTP response header to control how the response
		is cached by clients (browsers) and intermediate caches (proxies).*/
		w.Header().Set("Cache-Control", "no-cache")
		if err := json.NewEncoder(w).Encode([]any{posts, user_id}); err != nil {
			http.Error(w, "error encoding response", http.StatusInternalServerError)
		}
	}
}
