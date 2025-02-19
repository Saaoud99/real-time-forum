import { escapeHTML } from "../app/helpers.js";
import { isAuthenticated } from "../authentication/isAuth.js";
import { fetchHistory } from "./chatHistory.js";
import { fetchUsers } from "./displayUsers.js";
import { displayMessage, displaySentMessage } from "./chatHelpers.js";

const socketUrl = `ws://${document.location.host}/ws` /*handle if user enters from other pc*/
const socket = new WebSocket(socketUrl); 
export const onlineUsers = new Set();

socket.addEventListener('open', () => {
    console.log('WebSocket connection opened');
});

socket.addEventListener('error', (error) => {
    console.error('WebSocket error:', error);
});

socket.addEventListener('close', (event) => {
    console.log('WebSocket connection closed:', event.code, event.reason);
});

socket.addEventListener("message", (event) => {
    try {
        const newdata = JSON.parse(event.data);
        if (newdata.Status) {
            // if (newdata.Status === "online") {
            //     onlineUsers.add(newdata.UserID);
            // } else if (newdata.Status === "offline") {
            //     onlineUsers.delete(newdata.UserID);
            // }
            // updateUserStatus(newdata.UserID, newdata.Status);
        } else {
            displayMessage(newdata)
        }
    } catch (err) {
        console.error("Error parsing message:", err)
    }        
});

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

    document.querySelector('#send-btn').addEventListener('click', ()=> sendMessage(nickname));
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
        Timestamp: new Date()
    };
    displaySentMessage(message)
    socket.send(JSON.stringify(message));
    input.value = '';
}


