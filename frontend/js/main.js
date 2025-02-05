import { router } from "./routes.js";

export async function handleRoute() {

    const myroute = window.location.pathname;
    await router[myroute].call();
}
handleRoute();

/*  this part of the code Listens for clicks on elements 
    with the data-link attribute (likely navigation links)
    Prevents the default page reload behavior
    Updates the URL without refreshing the page using history.pushState
*/
document.addEventListener('click', (event) => {
    if (event.target.hasAttribute('data-link')) {
        const link = event.target.getAttribute('href')
        history.pushState(null, null, link);
        handleRoute();
    }
})


