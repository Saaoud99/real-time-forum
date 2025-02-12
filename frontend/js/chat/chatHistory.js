import { debounce } from "../app/helpers.js";

export async function fetchHistory(receiverNickname){
    const messages = document.querySelector('#messages')
    try {
        const res = await fetch(`/dm?receiver=${encodeURIComponent(receiverNickname)}`); 
        if (!res.ok){
            throw new Error('error fetching dm history')
        }
        const dms = await res.json();
                
        messages.replaceChildren();
        if (dms) displayHistory(dms);
         const debouncedDisplay = debounce((dms)=>{
            displayHistory(dms)
         }, 200);

         document.addEventListener('scroll', ()=>{
            debouncedDisplay(dms);
         });
    } catch (error) {
        console.error(error);
    }
}

function displayHistory(dms){
    const messages = document.getElementById('messages')
    if (!messages) {
        console.log('error in messages');
        return;
    }
    for (let i =0 ; i < 10 ; i++){
        const dm = dms.pop();
        if (dm){
            const messageCard = document.createElement('div');
            
            const messageContent = document.createElement('div');
            messageContent.id = `${dm.Sender_id}`
            messageContent.className = 'message-content';
            messageContent.textContent = dm.Content;

            
            
            // const messageTime = document.createElement('div');
            // messageTime.className = 'message-time';
            // messageTime.textContent = new Date(dm.Timestamp)
            // messageCard.appendChild(messageTime);
            
            messageCard.appendChild(messageContent);            
            messages.append(messageCard)
        }
    } 
}

/*
.message.sent {
    float: right;                
}


.message.received {
    float: left;                
}
*/ 