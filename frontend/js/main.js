import { renderNewPost } from './newPost.js';
import { fetchPost } from './posts.js';
import { renderRegisterForm } from './register.js'
import { renderLoginForm } from './login.js';
import { renderLogout } from './logedout.js';

function handleRoute() {
    const router = {
        '/login': renderLoginForm,
        '/register': renderRegisterForm,
        '/logout': renderLogout,
        '/newPost': renderNewPost,
        '/': fetchPost,
    }

    const myroute = window.location.pathname;
    router[myroute].call();
}
handleRoute();

document.addEventListener('click', (event) => {

    if (event.target.hasAttribute('data-link')) {
        const link = event.target.getAttribute('href')
        history.pushState(null, null, link);
        handleRoute();
    }
})




