import { router } from "./routes.js";


// this is not working i'll fix it tomorrow
function isAuthenticated(){
    return document.cookie.includes('forum_session=');
}
console.log(document.cookie.includes('forum_session='));



const publicRoutes = ['/login', '/register'];
const protectedRoutes = ['/', '/newPost', '/logout', '/comment'];

export async function handleRoute() {
    const currentPath = window.location.pathname;
    const isAuth = isAuthenticated();
    
    console.log(window.location.pathname);
    /* call() method is needed because you're invoking 
    a function dynamically (based on the path) from the router object */
    if (!isAuth && protectedRoutes.includes(currentPath)){
        // If not authenticated and trying to access protected route, redirect to login
        history.pushState(null, null, '/login');
        await router['/login'].call();
        return;
    }

    if (isAuth && publicRoutes.includes(currentPath)) {
        // If authenticated and trying to access public routes, redirect to home
        history.pushState(null, null, '/');
        await router['/'].call();
        return;
    }

    if (router[currentPath]) {
        await router[currentPath].call();
    } else {
        // Handle 404 or redirect to home
        history.pushState(null, null, '/');
        await router['/'].call();
    }

}

/*  this part of the code Listens for clicks on elements 
    with the data-link attribute (likely navigation links)
    Prevents the default page reload behavior
    Updates the URL without refreshing the page using history.pushState
*/
document.addEventListener('click', (event) => {
    if (event.target.hasAttribute('data-link')) {
        event.preventDefault();
        const link = event.target.getAttribute('href')
        history.pushState(null, null, link);
        handleRoute();
    }
})

// Handle browser back/forward buttons
// window.addEventListener('popstate', () => {
//     handleRoute();
// });

// Initial route handling
handleRoute();