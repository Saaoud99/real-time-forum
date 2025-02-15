package websoc

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"real-time-forum/backend/authentication"
	modles "real-time-forum/backend/mods"
	"sync"

	"github.com/gorilla/websocket"
)

type Hub struct {
	Clients map[*Client]bool
	// Broadcast  chan []byte
	Register   chan *Client
	Unregister chan *Client
	Send       chan modles.Message
	Mu         sync.Mutex
}

type Client struct {
	hub    *Hub
	conn   *websocket.Conn
	userID int
}

func HandleConnections(hub *Hub, db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := authentication.IsLoged(db, r)
		conn, err := Upgrader.Upgrade(w, r, nil)
		if err != nil {
			return
		}

		client := &Client{
			hub:    hub,
			conn:   conn,
			userID: userID,
		}
		client.hub.Register <- client

		defer func() {
			hub.Unregister <- client
		}()
		// go client.read(db, hub)
		for {
			_, mssg, err := conn.ReadMessage()
			if err != nil {
				fmt.Println(err)
				return
			}
			var msg modles.Message
			if err := json.Unmarshal(mssg, &msg); err != nil {
				continue
			}
			// var r_id int
			db.QueryRow(`SELECT id FROM users WHERE nickname = ? `, msg.ReceiverName).Scan(&msg.ReceiverID)
			// fmt.Println(r_id)
			_, err = db.Exec(`
			INSERT INTO chat (content, sender_id, receiver_id)
			VALUES (?, ?, ?)
        	`, msg.Content, msg.SenderID, msg.ReceiverID)

			hub.Mu.Lock()
			hub.Send <- msg
			hub.Mu.Unlock()
			// if err == nil {
			// 	c.hub.Broadcast <- msg
			// }
		}
		// go client.write(hub)
	}
}

var Upgrader = websocket.Upgrader{

	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func NewHub() *Hub {
	return &Hub{
		// Broadcast:  make(chan []byte),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Clients:    make(map[*Client]bool),
		Send:       make(chan modles.Message, 4096),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.Register:
			h.Mu.Lock()
			h.Clients[client] = true
			h.Mu.Unlock()
		case client := <-h.Unregister:
			h.Mu.Lock()
			if _, ok := h.Clients[client]; ok {
				delete(h.Clients, client)
				// close(client.hub.Send)
			}
			h.Mu.Unlock()
		case message := <-h.Send:
			h.Mu.Lock()
			for client := range h.Clients {
				if client.userID == message.ReceiverID {
					err := client.conn.WriteJSON(message)
					if err != nil {
						client.conn.Close()
						delete(h.Clients, client)
						fmt.Println(err)
						return
					}
				}
			}
			h.Mu.Unlock()
			// case message := <-h.Broadcast:
			// 	for client := range h.Clients {
			// 		select {
			// 		case client.send <- message:
			// 		default:
			// 			close(client.send)
			// 			delete(h.Clients, client)
			// 		}
			// 	}
		}
	}
}
