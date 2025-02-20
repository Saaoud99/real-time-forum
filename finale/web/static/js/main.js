import { Handlelogin } from "./login.js";
import { Handleregister } from "./register.js";
import { init } from "./mainn.js";
const nav = (path) => {
    window.history.pushState([], "", path)
    paths()
}


async function checkLogin() {
    try {
        const response = await fetch("/api/checklogin");
        const data = await response.json();

        console.log(data.isLoggedIn)
        return data.isLoggedIn ;
        // Use nullish coalescing to ensure false is returned if data.isLoggedIn is undefined
    } catch (error) {
        console.error("Error checking login:", error);
        return false; // Return false in case of an error
    }
}

async function paths() {
    
    console.log("chck login ===>", await checkLogin());
    
    if (location.pathname == "/login") {
        
        if (await checkLogin() === false){
            Handlelogin();
        }else{
            nav("/")
        }
    } else if (location.pathname === "/") {
        
        if (await checkLogin() === false){
            nav("/login")
        }else{
            init();
        }
              

    } else if (location.pathname == "/register") {
        if (await checkLogin()=== false){
            Handleregister()
        }else{
            init();
        }
    }else{
        const page = document.querySelector('.zone')
        page.innerHTML=`
        <h1>nothing to show<h1>
        `
    }
}


paths();

