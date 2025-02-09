package websoc

import (
	"database/sql"
	"fmt"
	"net/http"
	"time"

	modles "real-time-forum/backend/mods"

	"github.com/gorilla/websocket"
)

var (
	Upgrader = websocket.Upgrader{
		// Allow all origins for development
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
	Clients  = make(map[*websocket.Conn]bool)
	Brodcast = make(chan string)
)

type WebSocketMessage struct {
	Type       string    `json:"type"`
	Content    string    `json:"content"`
	SenderID   int       `json:"sender_id"`
	ReceiverID int       `json:"receiver_id"`
	Timestamp  time.Time `json:"timestamp"`
}

func HandleConnections(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	fmt.Print("kdhl websoc back\n")
	ws, err := Upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("error upgrading", err)
		return
	}
	// store client connecton
	Clients[ws] = true

	defer func() {
		delete(Clients, ws)
		ws.Close()
	}()

	for {
		var msg modles.Message
		if err := ws.ReadJSON(&msg); err != nil {
			fmt.Println("error reding json msg")
			break
		}
	}
}

// func HandleMessages() {
// 	for {
// 		msg := <-Brodcast
// 		for Client := range Clients {
// 			err := Client.WriteJSON(msg)
// 			if err != nil {
// 				Client.Close()
// 				delete(Clients, Client)
// 			}
// 			print(msg)
// 		}
// 	}
// }
