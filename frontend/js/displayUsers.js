const chat = document.getElementById('chat')
console.log(chat);


export async function fetchUsers() {
    console.log('entered fetchusers');
    
    try {
        const res = await fetch('/users');
        console.log(res);
        
        if (!res.ok){
            throw new Error("Failed to fetch users");
        }
        const users = await res.json();
          chat.replaceChildren();
         displayUsers(users);
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
    for (let i = 0; i<10; i++){
        const user = users.pop()
        if (user){
            const userCard = document.createElement('div');
            const profile = document.createElement('div');
            profile.className = 'profile';
            profile.innerText = `${user.firstName.slice(0, 1)+user.lastName.slice(0, 1)}`
            const nickname = document.createElement('div');
            nickname.className = 'nickname';
            nickname.innerText = `${user.nickname}`
            userCard.appendChild(profile);
            userCard.appendChild(nickname);
            chat.appendChild(userCard)
        }
    }
}