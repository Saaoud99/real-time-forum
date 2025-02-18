import { debounce, escapeHTML, toggleComments, timeAgo } from './helpers.js';

const container = document.getElementById('container')
export async function fetchPost() {
    try {
        const res = await fetch('/posts');
        if (!res.ok) {
            throw new error
        }
        const posts = await res.json();
        /*replaceChildren(); simply empties 
        out the content of the container element,*/
        container.replaceChildren();
        displayposts(posts); /*for first 10 posts*/
        const debouncedDisplay = debounce((posts) => {
            displayposts(posts);
        }, 300);

        document.addEventListener('scroll', () => {
            debouncedDisplay(posts);
        });

    } catch (error) {
        console.log(error);
        console.error(error);
    }
}


function displayposts(posts) {
    for (let i = 0; i < 10; i++) {
        const post = posts[0].shift();
        if (post) {
            const postCard = document.createElement('div')
            postCard.className = 'postCard'
            postCard.innerHTML = `
            <div class="title"> ${escapeHTML(post.Title)}</div >
             <div class="post-username">by @${escapeHTML(post.Username)}</div>
             <div class="post-content">${escapeHTML(post.Content)}</div>
            <div class="details-toggle" onclick="toggleDetails(this)">
               <span class="details-text">Details</span>
            </div>
            <div class="meta hidden">
            ${escapeHTML(post.Categories.join(", "))}, ${timeAgo(post.Created_at)}
              </div>

        <!-- Like section -->

        <!-- Comment section -->
                 <button class="comment-btn" onclick="toggleComments(${post.Id}, this)">Show Comments</button>
                <div class="comment-section hidden" id="comment-section-${post.Id}">
                  <textarea class="comment-input" id="comment-input-${post.Id}" placeholder="Your comment"></textarea>
                  <button class="send-comment-btn" onclick="loadComments(${post.Id}, 1)">Comment</button>
                  <div id="comments-list-${post.Id}" class="comments-list"></div>


            `

            container.appendChild(postCard)
        }
    }
}
window.escapeHTML = escapeHTML;
window.toggleComments = toggleComments;

