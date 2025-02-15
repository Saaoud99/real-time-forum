// call it in indixe
export async function loadComments(postId, userId) {
    const commentInput = document.getElementById(`comment-input-${postId}`);
    const commentContent = commentInput.value;

    try {
        const response = await fetch(`/comments?post_id=${postId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                post_id: postId,
                user_id: userId,
                content: commentContent,
            }),
        });        
        if (response.ok) {
            postComments(postId);
            commentInput.value = "";
        }
    } catch (error) {
        console.error("Error of posting comment:", error);
    }
}

import { timeAgo } from "./helpers.js";

export async function postComments(postId) {
    try {
        const response = await fetch(`/comments?post_id=${postId}`);
        const comments = await response.json();
        
        const commentsList = document.getElementById(`comments-list-${postId}`);
        commentsList.innerHTML = "";

        comments.reverse().forEach((comment) => {
            const commentElement = document.createElement("div");
            
        commentElement.innerHTML = `
            <div class="comment">
              <small>Posted by <b>@${comment.username}</b>, ${timeAgo(comment.created_at)}</small>
              <p>${escapeHTML(comment.content)}</p>
            </div>
      `;
            commentsList.appendChild(commentElement);
        });
    } catch (error) {
        console.error("Error of loading comments:", error);
    }
}

window.loadComments = loadComments