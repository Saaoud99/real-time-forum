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
	Clients    map[*Client]bool
	Broadcast  chan []byte
	Register   chan *Client
	Unregister chan *Client
}

type Client struct {
	hub    *Hub
	conn   *websocket.Conn
	send   chan []byte
	userID int
}

func (c *Client) read(db *sql.DB) {
	defer func() {
		c.hub.Unregister <- c
		c.conn.Close()
	}()

	for {
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			fmt.Println(err)
			break
		}

		var msg modles.Message
		if err := json.Unmarshal(message, &msg); err != nil {
			continue
		}
		var r_id int
		db.QueryRow(`SELECT id FROM users WHERE nickname = ? `, msg.ReceiverName).Scan(&r_id)
		fmt.Println(r_id)
		_, err = db.Exec(`
            INSERT INTO chat (content, sender_id, receiver_id)
            VALUES (?, ?, ?)
        `, msg.Content, msg.SenderID, r_id)

		if err == nil {
			c.hub.Broadcast <- message
		}
	}
}

func (c *Client) write() {
	fmt.Println("write invoked")
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

		go client.write()
		go client.read(db)
	}
}

var Upgrader = websocket.Upgrader{

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
