import { Handlelogin } from "./login.js";
import { Handleregister } from "./register.js";
import { init } from "./mainn.js";

const nav = (path) => {
    window.history.pushState({}, "", path);
    paths();
};

function paths() {
    if (location.pathname === "/login") {
        Handlelogin();
    } else if (location.pathname === "/") {
        async function checkLogin() {
            try {
                const response = await fetch("/api/checklogin");
                const data = await response.json();

                if (data.isLoggedIn) {
                    init();
                } else {
                    // Only redirect to login if the user explicitly tries to access "/"
                    if (!window.history.state || !window.history.state.manualNavigation) {
                        nav("/login");
                    }
                }
            } catch (error) {
                console.error("Error checking login:", error);
            }
        }

        checkLogin();
    } else if (location.pathname === "/register") {
        Handleregister();
    } else {
        const page = document.querySelector(".zone");
        page.innerHTML = `
        <h1>Nothing to show</h1>
        `;
    }
}

window.addEventListener("popstate", paths);


paths();
