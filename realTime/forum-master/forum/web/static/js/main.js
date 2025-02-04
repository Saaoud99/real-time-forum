import { Login } from "./views/login.js";
import { Register } from "./views/register.js";
import { Home } from "./views/home.js"

function operation(){
  
  const views = new Map([
      ["login", Login],
      ["register", Register],
      ["", Home],
    ]);
  
  const path = window.location.pathname.replace(/^\/|\/$/g, '');
  
  const view = views.get(path); 
  if (view) {
    const View = new view();
    View.init();
  } else {
    console.error(`View not found for path: ${path}`);
  }
}

function redicrect(url){
  history.pushState(null, null, url)
  operation()

}
document.addEventListener("DOMContentLoaded", operation)
export default {redicrect}





