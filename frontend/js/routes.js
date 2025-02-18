import { renderNewPost } from './app/newPost.js';
import { fetchPost } from './app/posts.js';
import { renderRegisterForm } from './app/register.js'
import { renderLoginForm } from './app/login.js';
import { renderLogout } from './app/logedout.js';
import { postComments } from './app/comments.js';
import { fetchUsers } from './chat/displayUsers.js';
import {setuplayout} from './setupLayout.js';



export const router = {
    '/login': renderLoginForm,
    '/register': renderRegisterForm,
    '/logout': renderLogout,
    '/newPost': renderNewPost,
    '/comment': postComments,
    '/': () => {
        setuplayout();
        fetchPost();
        fetchUsers();
    },
}