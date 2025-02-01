import { Login } from "./views/login.js";
import { Register } from "./views/register.js";


const views = new Map([
    ["login", Login],
    ["register", Register],
  ]);

const path = window.location.pathname.replace(/^\/|\/$/g, '');

const view = views.get(path); 
if (view) {
  const View = new view();
  View.init();
} else {
  console.error(`View not found for path: ${path}`);
}







