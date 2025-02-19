export function displayMessage(data) {
    const messages = document.querySelector('#messages');
    
    const messageCard = document.createElement('div');
    messageCard.id = 'msg-received'
    messageCard.className = 'message';

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = escapeHTML(data.Content);
    
    const messageTime = document.createElement('div');
    messageTime.className = 'time-received';
    messageTime.textContent = (new Date(data.Timestamp));
    
    messageCard.appendChild(messageContent);            
    messageCard.appendChild(messageTime);
    messages.append(messageCard);
}

export function displaySentMessage(message) {
    const messages = document.querySelector('#messages');
    
    const messageCard = document.createElement('div');
    messageCard.id = 'msg-sent';
    messageCard.className = 'message';

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = escapeHTML(message.Content);

    const messageTime = document.createElement('div');
    messageTime.className = 'time-sent';
    messageTime.textContent = (new Date(message.Timestamp));
    
    messageCard.appendChild(messageContent);            
    messageCard.appendChild(messageTime);
    messages.appendChild(messageCard);      
}

export function updateUserStatus(userId, status) {
    const userCards = document.querySelectorAll('.user-card');
    userCards.forEach(card => {
        if (card.dataset.userId === userId.toString()) {
            const statusDot = card.querySelector('.status-dot');
            if (status === "online") {
                statusDot.classList.add('online');
            } else {
                statusDot.classList.remove('online');
            }
        }
    });
}

export function online(user, profile){
    const statusDot = document.createElement('div');
    statusDot.className = 'status-dot';
    if (onlineUsers.has(user.ID)) {
        statusDot.classList.add('online');
    }
    profile.appendChild(statusDot);
}