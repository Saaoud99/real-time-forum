// UpdateLike fetches and updates the UI with current like/dislike counts
// Bug: Attempts to use response.json() twice which will fail
export async function UpdateLike(post, classNm) {
    // Fetches current like counts from server
    // Updates UI elements with new counts
    // Handles both post and comment like displays
    try {
        console.log(post, classNm)
        const response = await fetch("/like");
        const likes = await response.json();
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log(response.json());

        post.querySelector(`.${classNm}-actions .${classNm}-likes`).textContent = `${likes.LikeCOunt}  `;
        post.querySelector(`.${classNm}-actions .${classNm}-dislikes`).textContent = `${likes.DislikeCOunt} `;

    } catch (err) {
        console.error("Error fetching likes:", err);
    }
}

// likeEvent sets up click handlers for like/dislike buttons
// Handles both posts and comments through a single function
// Disables like functionality for non-logged-in users
export function likeEvent(post, commentId, postId) {
    // Sets class based on whether target is post or comment
    // Disables buttons if user isn't logged in
    // Sets up click listeners that:
    //   - Send like/dislike action to server
    //   - Updates UI with new counts
    //   - Shows error message if user not found
    // Bug: Uses window.cookie directly which might not be secure
    // Bug: Error message appended to document without specific parent
    let clss = "post"
    if (commentId !== null) {
        clss = "comment"
    }

    let likeButton = post.querySelectorAll(`.${clss}-actions .${clss}-btn`);

    if (window.cookie == "") {
        likeButton.disabled = true;
        likeButton.style.backgroundcolor = "#a9a9a9";
        likeButton.style.cursor = "not-allowed";
    } else {
        likeButton.forEach((element) => {
            element.addEventListener("click", async () => {
                try {
                    const response = await fetch("/like", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            UserId: 0,
                            PostId: parseInt(postId) || parseInt(
                                post.querySelector(`.${clss}-actions .${clss}-btn`).id
                            ),
                            CommentId: commentId || -1,
                            LikeCOunt: 0,
                            Type: element.classList.contains("dislike") ? "dislike" : "like",
                        }),
                    });
                    if (!response.ok) {
                        const err = document.querySelector(".error-mssg");
                        if (!err) {
                            const erroemssg = document.createElement("p");
                            erroemssg.className = "error-mssg";
                            erroemssg.innerHTML = "user not found";
                            document.appendChild(erroemssg);
                        }
                    }
                    await UpdateLike(post, clss);
                } catch (err) {
                    console.log(err);
                }
            });
        });
    }
}

window.UpdateLike = UpdateLike;
window.likeEvent = likeEvent;