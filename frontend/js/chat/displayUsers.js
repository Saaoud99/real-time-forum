import { debounce, escapeHTML } from "../app/helpers.js";
import {chatArea} from './chatArea.js';

export async function fetchUsers() {    
    createChat()
    try {
        const res = await fetch('/users');        
        if (!res.ok){
            throw new Error("Failed to fetch users");
        }
        const users = await res.json();
        document.querySelector('#chat').replaceChildren();
         displayUsers(users);
         // debounce displaying the users to not spam the document
         const debouncedDisplay = debounce((users) => {
             displayUsers(users);
         }, 300);

         document.addEventListener('scroll', () => {
             debouncedDisplay(users);
         });
    } catch (error){
        console.log(error)
        console.error(error);
    }
}

function displayUsers(users){
    const chat = document.querySelector('#chat');
    for (let i = 0; i < 30; i++){
        const user = users.shift()
        if (user){
            const userCard = document.createElement('div');
            userCard.className = 'user-card';

            const profile = document.createElement('div');
            profile.className = 'profile';
            profile.innerText = `${user.firstName[0]}${user.lastName[0]}`
            // profile.style.backgroundColor = 'wite';
            
            const nickname = document.createElement('div');
            nickname.className = 'nickname';
            nickname.innerText = `${escapeHTML(user.nickname)}`

            userCard.appendChild(profile);
            userCard.appendChild(nickname);
            // click on user to display chat area
            userCard.addEventListener('click', () => {
                chatArea(escapeHTML(user.nickname));
                console.log(user.id);
                
            });
            chat.appendChild(userCard);
        }
    }
}



function createChat(){
    const app = document.querySelector('#app');
    if (!document.querySelector('#chat')){
        const chat = document.createElement('div');
        chat.className = 'chat'
        chat.id = 'chat'
        chat.href = "/chat";
        chat.setAttribute("data-link", "/chat");
        app.appendChild(chat)
    }
}