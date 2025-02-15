import { debounce } from "../app/helpers.js";
import { isAuthenticated } from "../authentication/isAuth.js";
export async function fetchHistory(receiverNickname) {
    const messages = document.querySelector('#messages')
    if (!messages) {
        console.error('Messages container not found');
        return;
    }
    const id = await isAuthenticated();
    try {
        const res = await fetch(`/dm?receiver=${encodeURIComponent(receiverNickname)}`);
        if (!res.ok) {
            throw new Error('error fetching dm history')
        }
        const dms = await res.json();

        messages.replaceChildren();
        if (dms) displayHistory(dms, id);
        // const debouncedDisplay = debounce((dms, id) => {
        //     displayHistory(dms, id)
        // }, 200);

        // document.addEventListener('scroll', () => {
        //     debouncedDisplay(dms, id);
        // });
    } catch (error) {
        console.error(error);
    }
}

// type Message struct {
// 	Type       string    `json:"Type"`
// 	Content    string    `json:"Content"`
// 	SenderID   int       `json:"Sender_id"`
// 	ReceiverID int       `json:"Receiver_id"`
// 	ReceiverName string  `json:"Receiver_name"`
// 	Timestamp  time.Time `json:"Timestamp"`
// }

function displayHistory(dms, id) {

    const messages = document.getElementById('messages')
    if (!messages) {
        console.log('error in messages');
        return;
    }
    for (let i = 0; i < dms.length; i++) {
        const dm = dms.pop();
        if (dm) {
            const messageCard = document.createElement('div');
            messageCard.className = 'message';

            if (id === dm.Sender_id) {
                messageCard.id = 'msg-sent';
            } else {
                messageCard.id = 'msg-received'
            }

            const messageContent = document.createElement('div');
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

