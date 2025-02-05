export async function UpdateLike(post, classNm) {
    console.log('entered');
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




export function likeEvent(post, commentId, postId) {    
    let clss = "post"
    if (commentId !== undefined) {
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