import { fetchHistory } from "./chatHistory.js";
import { fetchUsers } from "./displayUsers.js";
// import { socket } from "./handleConn.js";

const socket = new WebSocket(`ws://${document.location.host}/ws`); /*handle if user enters from other pc*/

export function chatArea(userId, nickname) {
    const chat = document.querySelector('#chat');
    chat.innerHTML = `
        <div id="user-card">
            <div class="chat-header">
                <button class="back-btn">←</button>
                <span>${nickname}</span>
            </div>
            <div class="messages-container" id="messages">
                <!-- Messages will be inserted here -->
            </div>
            <div class="input-area">
                <input type="text" id="message-input" placeholder="Type a message...">
                <button id="send-btn">Send</button>
            </div>
        </div>
    `;
    
    // Event listeners
    chat.addEventListener('click', ()=>{
        fetchHistory();
    })
    document.querySelector('.back-btn').addEventListener('click', () => {
        fetchUsers();
    });

    document.querySelector('#send-btn').addEventListener('click', sendMessage);
    document.querySelector('#message-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

}
function sendMessage() {
    const input = document.querySelector('#message-input');
    const content = input.value.trim();
    console.log(content);
    
    if (!content) return;

    const message = {
        type: "dm",
        content: content,
        sender_id: 2,//getCurrentUserId(), // Implement this based on your auth
        receiver_id: 1,
    };
    socket.send(JSON.stringify(message));
    input.value = '';
}