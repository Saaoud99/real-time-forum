const app = document.getElementById('app')

export function renderLoginForm() {    
    app.innerHTML = `
    <h2>Login</h2>
    <form id="loginForm">
      <input type="text" id="loginNickname" placeholder="Enter your email or nickname" required><br>
      <input type="password" id="loginPassword" placeholder="Enter your password" required><br>
      <button type="submit">Login</button>
    </form>
              `;
    document.getElementById("loginForm").addEventListener("submit", logUser);
}

async function logUser(event) {
    event.preventDefault();
    let LoginCredentials = {
        login: document.getElementById("loginNickname").value,
        password: document.getElementById("loginPassword").value
    }
    
    let res = await fetch('/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(LoginCredentials)
    });
    if (res.ok) {
        history.pushState(null, null, '/');
    }
    let data = await res.text();
    alert(data);
}