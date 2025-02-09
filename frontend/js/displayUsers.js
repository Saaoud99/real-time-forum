import { debounce } from "./helpers.js";

const chat = document.getElementById('chat')

export async function fetchUsers() {    
    try {
        const res = await fetch('/users');        
        if (!res.ok){
            throw new Error("Failed to fetch users");
        }
        const users = await res.json();
          chat.replaceChildren();
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
    for (let i = 0; i < 30; i++){
        const user = users.pop()
        if (user){
            const userCard = document.createElement('div');
            userCard.className = 'user-card';

            const profile = document.createElement('div');
            profile.className = 'profile';
            profile.innerText = `${user.firstName[0]}${user.lastName[0]}`
            profile.style.backgroundColor = getRandomColor();
            
            const nickname = document.createElement('div');
            nickname.className = 'nickname';
            nickname.innerText = `${user.nickname}`

            userCard.appendChild(profile);
            userCard.appendChild(nickname);
            chat.appendChild(userCard)
        }
    }
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}