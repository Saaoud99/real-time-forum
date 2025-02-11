package websoc

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"real-time-forum/backend/authentication"
	modles "real-time-forum/backend/mods"

	"github.com/gorilla/websocket"
)

type Hub struct {
	// Registered clients.
	Clients map[*Client]bool

	// Inbound messages from the clients.
	Broadcast chan []byte

	// Register requests from the clients.
	Register chan *Client

	// Unregister requests from clients.
	Unregister chan *Client
}

type Client struct {
	hub    *Hub
	conn   *websocket.Conn
	send   chan []byte
	userID int
}

func (c *Client) readPump(db *sql.DB) {
	fmt.Println("readPump invoked")
	defer func() {
		c.hub.Unregister <- c
		c.conn.Close()
	}()

	for {
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			break
		}

		var msg modles.Message
		if err := json.Unmarshal(message, &msg); err != nil {
			continue
		}

		// Save to database
		_, err = db.Exec(`
            INSERT INTO chat (content, sender_id, receiver_id)
            VALUES (?, ?, ?)
        `, msg.Content, msg.SenderID, msg.ReceiverID)

		if err == nil {
			c.hub.Broadcast <- message
		}
	}
}

func (c *Client) writePump() {
	fmt.Println("writePump invoked")
	defer c.conn.Close()
	for {
		message, ok := <-c.send
		if !ok {
			c.conn.WriteMessage(websocket.CloseMessage, []byte{})
			return
		}

		var msg modles.Message
		if err := json.Unmarshal(message, &msg); err != nil {
			continue
		}

		// Only send if client is sender or receiver
		if msg.SenderID == c.userID || msg.ReceiverID == c.userID {
			if err := c.conn.WriteMessage(websocket.TextMessage, message); err != nil {
				return
			}
		}
	}
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
			send:   make(chan []byte, 4096),
			userID: userID,
		}
		client.hub.Register <- client

		go client.writePump()
		go client.readPump(db)
	}
}

var Upgrader = websocket.Upgrader{
	// Allow all origins for development
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func NewHub() *Hub {
	return &Hub{
		Broadcast:  make(chan []byte),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Clients:    make(map[*Client]bool),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.Register:
			h.Clients[client] = true
		case client := <-h.Unregister:
			if _, ok := h.Clients[client]; ok {
				delete(h.Clients, client)
				close(client.send)
			}
		case message := <-h.Broadcast:
			for client := range h.Clients {
				select {
				case client.send <- message:
				default:
					close(client.send)
					delete(h.Clients, client)
				}
			}
		}
	}
}
