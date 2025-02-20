import { router } from "./routes.js";
import { isAuthenticated } from "./authentication/isAuth.js";

const publicRoutes = ["/login", "/register"];
const protectedRoutes = ["/", "/newPost", "/logout", "/comment"];

export async function handleRoute() {
  const currentPath = window.location.pathname;
  const isAuth = await isAuthenticated();
  if (isAuth === 0 && protectedRoutes.includes(currentPath)) {
    history.pushState(null, null, "/login");
    await router["/login"].call();
    return;
  }

  if (isAuth !== 0 && publicRoutes.includes(currentPath)) {
    history.pushState(null, null, "/");
    await router["/"].call();
    return;
  }

  if (router[currentPath]) {
    await router[currentPath].call();
  } else {
    // Handle 404 or redirect to home
    history.pushState(null, null, "/");
    await router["/"].call();
  }
}

/*  this part of the code Listens for clicks on elements 
    with the data-link attribute (likely navigation links)
    Prevents the default page reload behavior
    Updates the URL without refreshing the page using history.pushState
*/
document.addEventListener("click", (event) => {
  if (event.target.hasAttribute("data-link")) {
    event.preventDefault();
    const link = event.target.getAttribute("href");
    history.pushState(null, null, link);
    handleRoute();
  }
});

// Handle browser back/forward buttons
window.addEventListener("popstate", () => {
  handleRoute();
});

// Initial route handling
await handleRoute();

// why it does not get applyed until i refresh this is an spa
