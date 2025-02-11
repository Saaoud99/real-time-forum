import { Handlelogin } from "./login.js";
import { Handleregister } from "./register.js";
import { init } from "./mainn.js";
const nav = (path) => {
    window.history.pushState([], "", path)
    paths()
}
function paths() {
    if (location.pathname == "/login") {
        Handlelogin();
    } else if (location.pathname == "/") {
        
        async function checkLogin() {
                 try {
                     const response = await fetch("/api/checklogin");
                     const data = await response.json();
    
                     if (data.isLoggedIn) {
                         init();
                        } else {   
                            nav("/login"); 
                        }
                    } catch (error) {
                        console.error("Error checking login:", error);
                    }
                }
    
                checkLogin(); 

    } else if (location.pathname == "/register") {
        Handleregister();
    }
}


paths();
