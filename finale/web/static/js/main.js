import { init } from "./mainn.js";
import { Handlelogin } from "./login.js";
import { Handleregister } from "./register.js";



function handle() {

     console.log(location.pathname);
     if (location.pathname == "/"){
         async function checkLogin() {
             try {
                 const response = await fetch("/api/checklogin");
                 const data = await response.json();
                 
                 
                 if (data.isLoggedIn) {
                     init();
                    } else {
                        location.href = "/login"; 
                    }
                } catch (error) {
                    console.error("Error checking login:", error);
                }
            }
            
            checkLogin(); 
            
        }else if (location.pathname == "/login"){
            
        
            async function checkLogin() {
                try {
                    const response = await fetch("/api/checklogin");
                
                
                    console.log(response);
                    const data = await response.json();
                
                if (data.isLoggedIn) {
                    console.log("rah mlogi")
                    init();
                } else {
                    Handlelogin(); 
                }
            } catch (error) {
                console.error("Error checking login:", error);
            }
        }
        
        checkLogin(); 
    }else if (location.pathname == "/register"){
        async function checkLogin() {
            try {
                const response = await fetch("/api/checklogin");
                
                
                console.log(response);
                const data = await response.json();
                
                if (data.isLoggedIn) {
                    init();
                } else {
                    Handleregister(); 
                }
            } catch (error) {
                console.error("Error checking login:", error);
            }
        }
        
        checkLogin(); 
    }
}

document.addEventListener("DOMContentLoaded", ()=>{
    console.log("hadi dyal DOM ");
    
    handle();
})