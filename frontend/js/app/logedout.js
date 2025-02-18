import { renderLoginForm } from "./login.js";
export async function renderLogout() {
    document.querySelector('#button-group').remove();
    document.querySelector('#forum').remove();
    const res = await fetch('/logout', {
        method: 'POST',
        credentials: 'same-origin',
    });
    if (!res.ok) {
        return;
    }
    renderLoginForm()
}