package websoc

import (
	modles "real-time-forum/backend/mods"
	"sync"

	"github.com/gorilla/websocket"
)

type Hub struct {
	Clients map[*Client]bool
	Register   chan *Client
	Unregister chan *Client
	Send       chan modles.Message
	Mu         sync.Mutex
	// tracks online status by userID
	OnlineUsers    map[int]bool     
    OnlineClients  map[int][]*Client
}

type Client struct {
	hub    *Hub
	conn   *websocket.Conn
	userID int
}
