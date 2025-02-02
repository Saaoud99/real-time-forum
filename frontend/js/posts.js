const app = document.getElementById('app')
 const container = document.getElementById('container')
export async function fetchPost() {
    try {
        const res = await fetch('/posts');
        if (!res.ok) {
            throw new error
        }
        const posts = await res.json();
        posts.forEach(post => {
            console.log(post.Usrename);
            
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
        ${escapeHTML(post.Categories.join(", "))}, ${post.Created_at}
          </div>
         <div class="post-actions">
          <button class="post-btn like" style="background:none;" id="${post.Id}">👍</button>
          <div class="post-likes like">${escapeHTML(post.Likes.toString())} </div>
          <button class="post-btn dislike", style="background:none;"  id = ${post.Id}>👎</button>
          <div class="post-dislikes" >${escapeHTML(post.Dislikes.toString())} </div>
        </div >
         <button class="comment-btn" onclick="toggleComments(${post.Id}, this)">Show Comments</button>
        <div class="comment-section hidden" id="comment-section-${post.Id}">
          <textarea class="comment-input" id="comment-input-${post.Id}" placeholder="Your comment"></textarea>
          <button class="send-comment-btn" onclick="postComment(${post.Id}, 1)">Comment</button>
          <div id="comments-list-${post.Id}" class="comments-list"></div>
            `
            container.appendChild(postCard)
        });
    } catch (error) {
        console.error(error);
    }
}
export function escapeHTML(str) {
    if (typeof str !== "string") return "";
    return str.replace(
        /[&<>'"]/g,
        (tag) =>
        ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "'": "&#39;",
            '"': "&quot;",
        }[tag] || tag)
    );
}
window.escapeHTML = escapeHTML;
