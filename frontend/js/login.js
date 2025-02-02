const app = document.getElementById('app')

export function renderLoginForm() {
    app.innerHTML = `
    <h2>Login</h2>
    <form id="loginForm">
      <input type="text" id="loginNickname" placeholder="Enter your email or nickname" ><br>
      <input type="password" id="loginPassword" placeholder="Enter your password" ><br>
      <button type="submit">Login</button>
    </form>
              `;
}