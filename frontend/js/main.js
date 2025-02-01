import { renderNewPost } from './newPost.js';
import { renderRegisterForm, app } from './register.js'

function handleRoute() {
    const router = {
        '/login': renderLoginForm,
        '/register': renderRegisterForm,
        '/logout': renderLogout,
        '/newPost': renderNewPost,
    }

    const myroute = window.location.pathname;
    router[myroute].call();
}
export function renderLoginForm() {
    app.innerHTML = `
        <h2>Login</h2>
        <form id="loginForm">
          <input type="text" id="loginNickname" placeholder="Enter your nickname" ><br>
          <input type="password" id="loginPassword" placeholder="Enter your password" ><br>
          <button type="submit">Login</button>
        </form>
      `;
}

export function renderLogout() {
    app.innerHTML = `<h2>You have been logged out.</h2>`;
}

document.addEventListener('click', (event) => {
    console.log(event);

    if (event.target.hasAttribute('data-link')) {
        const link = event.target.getAttribute('href')
        history.pushState(null, null, link);
        handleRoute();
    }
})