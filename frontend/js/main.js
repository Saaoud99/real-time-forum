import { router } from "./routes.js";

export async function handleRoute() {

    const myroute = window.location.pathname;
    console.log(router[myroute]);
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




