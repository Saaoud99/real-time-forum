import { renderRegisterForm, app } from './register.js'


function renderLoginForm() {
    app.innerHTML = `
        <h2>Login</h2>
        <form id="loginForm">
          <input type="text" id="loginNickname" placeholder="Enter your nickname" ><br>
          <input type="password" id="loginPassword" placeholder="Enter your password" ><br>
          <button type="submit">Login</button>
        </form>
      `;
}

function renderLogout() {
    app.innerHTML = `<h2>You have been logged out.</h2>`;
}

document.getElementById("register").addEventListener("click", () => {
    history.pushState({}, "", "/register");
    renderRegisterForm();
});
document.getElementById("login").addEventListener("click", renderLoginForm);
document.getElementById("logout").addEventListener("click", renderLogout);
document.addEventListener('click', (event) => {
    console.log(event);

    if (event.target.hasAttribute('data-link')) {
        const link = event.target.getAttribute('href')
        history.pushState(null, null, link);
    }
})