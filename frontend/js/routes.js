import { renderNewPost } from './newPost.js';
import { fetchPost } from './posts.js';
import { renderRegisterForm } from './register.js'
import { renderLoginForm } from './login.js';
import { renderLogout } from './logedout.js';
import { postComments } from './comments.js';
// import { HandleConn } from './chat/handleConn.js';
import { fetchUsers } from './displayUsers.js';

export const router = {
    '/login': renderLoginForm,
    '/register': renderRegisterForm,
    '/logout': renderLogout,
    '/newPost': renderNewPost,
    '/comment': postComments,
    // '/chat': HandleConn,
    '/': () => {
        fetchPost();
        fetchUsers();
    },
}