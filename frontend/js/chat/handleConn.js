// const socket = new WebSocket('ws://localhost:4011/ws');

// export function HandleConn(){
//     socket.onopen = function () {
//         console.log('WebSocket connection established');
//         const message = {
//             type: "message",
//             content: "Hello, WebSocket Server!",
//             senderID: 1,
//             receiverID: 0,
//             timestamp: new Date()
//         };
//         socket.send(JSON.stringify(message));
//     };
// }




// socket.onopen = function () {
//     console.log('WebSocket connection established');
//     socket.send('Hello, WebSocket Server!');
// };

// socket.onmessage = function (event) {
//     console.log('Received message from server:', event.data);
// };

// socket.onerror = function (error) {
//     console.error('WebSocket error:', error);
// };

// socket.onclose = function () {
//     console.log('WebSocket connection closed');
// };

