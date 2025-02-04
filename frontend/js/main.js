import { router } from "./routes.js";
import { hasCookie } from "./helpers.js";

export async function handleRoute() {

    const myroute = window.location.pathname;
    await router[myroute].call();
}
handleRoute();

document.addEventListener('click', (event) => {

    if (event.target.hasAttribute('data-link')) {
        const link = event.target.getAttribute('href')
        history.pushState(null, null, link);
        handleRoute();
    }
})

// Example usage:
if (hasCookie('forum_session')) {
    console.log('User has the "userSession" cookie');
} else {
    console.log('User does not have the "userSession" cookie');
}
