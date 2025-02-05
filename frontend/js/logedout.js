import { renderLoginForm } from "./login.js";
/*The credentials: 'include' setting is primarily used in fetch requests to 
automatically send cookies and authentication headers with cross-origin requests.
This is particularly important when making requests to different
domains (cross-origin requests) where you need to maintain authentication state
By default, browsers don't send credentials (cookies, HTTP authentication, and client-side SSL certificates)
with cross-origin requests for security reasons.*/
export async function renderLogout() {
    const res = await fetch('/logout', {
        method: 'POST',
        credentials: 'same-origin',
    });
    if (!res.ok) {
        return;
    }
    renderLoginForm()
}