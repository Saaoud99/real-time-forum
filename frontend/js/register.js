// function renderRegisterForm() {
//     const app = document.getElementById("app");
//     if (!app) {
//         console.log('couldnt find app');
//         return;
//     }
//     console.log('11111111111111111111111111111111111');
    
//     app.innerHTML = `
//         <h2>Register</h2>
//         <form id="registerForm">
//           <input type="text" placeholder="Enter your username" required><br>
//           <input type="email" placeholder="Enter your email" required><br>
//           <input type="password" placeholder="Enter your password" required><br>
//           <button type="submit">Register</button>
//         </form>
//       `;
// }

// export function setupRegisterButton() {
//     console.log('222222222222222222222222222222222222');
    
//     document.addEventListener("DOMContentLoaded", () => {
//         const registerBtn = document.getElementById("register");
//         if (registerBtn) {
//             registerBtn.addEventListener("click", renderRegisterForm);
//         } else {
//             console.error("Error: Register button not found!");
//         }
//     });
// }