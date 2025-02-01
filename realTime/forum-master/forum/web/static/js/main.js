import { Login } from "./views/login.js";


const views = new Map([
  //  ["/", Home],
    ["login", Login],
    // ["register", 200],
    // ["/post/{id}", 500],
    // ["chat/", 300],
  ]);

const path = window.location.pathname.replace(/^\/|\/$/g, '');


const view = views.get(path); // Use get() method of Map
if (view) {
  const View = new view();
  View.init();
} else {
  console.error(`View not found for path: ${path}`);
}


// // console.log(path)
// // console.log("ht")
// // const view = views[path]
// const View = new view()
// View.init()





