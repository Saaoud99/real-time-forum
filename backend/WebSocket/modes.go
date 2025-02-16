package websoc

import (
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
