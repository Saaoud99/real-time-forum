import { timeAgo, escapeHTML } from "../app/helpers.js";
import { isAuthenticated } from "../authentication/isAuth.js";
import { fetchHistory } from "./chatHistory.js";
import { fetchUsers } from "./displayUsers.js";

const socket = new WebSocket(`ws://${document.location.host}/ws`); /*handle if user enters from other pc*/
console.log(socket);


export function chatArea(nickname) {
    const chat = document.querySelector('#chat');
    chat.innerHTML = `
        <div id="user-card">
            <div class="chat-header">
                <button class="back-btn">←</button>
                <span>${escapeHTML(nickname)}</span>
            </div>
            <div class="messages-container" id="messages">
                <!-- Messages will be inserted here -->
            </div>
            <div class="input-area">
                <input type="text" id="message-input" placeholder="Type a message...">
                <button id="send-btn">
                    <img src="/frontend/img/send.png" alt="Send" class="send-icon">
                </button>
            </div>
        </div>
    `;
    
    // later
    chat.addEventListener('click', ()=>{
        fetchHistory(nickname);
    });

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
        Sender_id: sender_id,
        Receiver_name: nickname,
    };
    const messages = document.querySelector('#messages');
    
    const messageCard = document.createElement('div');
    messageCard.id = 'msg-sent';
    messageCard.className = 'message';

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = escapeHTML(content);

    const messageTime = document.createElement('div');
    messageTime.className = 'time-sent';
    messageTime.textContent = timeAgo(new Date());
    
    messageCard.appendChild(messageContent);            
    messageCard.appendChild(messageTime);
    messages.appendChild(messageCard);
        socket.send(JSON.stringify(message));
        input.value = '';
}


socket.addEventListener("message", (event) => {
    // console.log(event);
    const newdata = JSON.parse(event.data);
    console.log(newdata);
    
    const messages = document.querySelector('#messages');

    const messageCard = document.createElement('div');
    messageCard.id = 'msg-received'
    messageCard.className = 'message';

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = escapeHTML(newdata.Content);
    
    const messageTime = document.createElement('div');
    messageTime.className = 'time-rececived';
    messageTime.textContent = timeAgo(new Date(escapeHTML(newdata.Timestamp)));
    
    messageCard.appendChild(messageContent);            
    messageCard.appendChild(messageTime);
    messages.appendChild(messageCard);
});
