import { isAuthenticated } from "../authentication/isAuth.js";
import { fetchHistory } from "./chatHistory.js";
import { fetchUsers } from "./displayUsers.js";
// import { socket } from "./handleConn.js";

const socket = new WebSocket(`ws://${document.location.host}/ws`); /*handle if user enters from other pc*/

socket.addEventListener("message", (event) => {
    const newdata = JSON.parse(event.data);
    const messages = document.querySelector('#messages');
            console.log(messages);
            
    const messageCard = document.createElement('div');
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = newdata.Content;
    
    // console.log(messages);
    // const messageTime = document.createElement('div');
    // messageTime.className = 'message-time';
    // messageTime.textContent = new Date(dm.Timestamp)
    // messageCard.appendChild(messageTime);
    
    messageCard.appendChild(messageContent);            
    messages.appendChild(messageCard);
  });

export function chatArea(nickname) {
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
        fetchHistory(nickname);
    })
    document.querySelector('.back-btn').addEventListener('click', () => {
        fetchUsers();
    });

    document.querySelector('#send-btn').addEventListener('click', sendMessage);
    document.querySelector('#message-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage(nickname);
    });

}
async function sendMessage(nickname) {
    const input = document.querySelector('#message-input');
    const content = input.value.trim();
    const sender_id = await isAuthenticated();    
    if (!content) return;

    const message = {
        Content: content,
        Sender_id: sender_id,//getCurrentUserId(), // Implement this based on your auth
        Receiver_name: nickname,
    };
    // console.log('msg :', message);
    const messages = document.querySelector('#messages');
    // console.log(messages);
    
const messageCard = document.createElement('div');

const messageContent = document.createElement('div');
messageContent.className = 'message-content';
messageContent.textContent = content;
messageCard.appendChild(messageContent);            
messages.appendChild(messageCard);
    socket.send(JSON.stringify(message));
    input.value = '';
}