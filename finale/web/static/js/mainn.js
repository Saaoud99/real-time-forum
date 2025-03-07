const page = document.querySelector('.zone')
page.innerHTML = ''
page.innerHTML = `
        <nav class="navbar">
            <a id="logo" href="/">
                <img id="logo-img" src="/assets/img/logo.svg" alt="">
                <span id="logo-name"><b>01</b>Forum</span>
            </a>
            <div class="sign">
                <button id="create" ><i class="plus-icon"></i>new post</button>
                <button id="logout" ><i class="logout-icon"></i>logout</button>
            </div>
        </nav>
    
    
        <div class="container">
            <div class="sidebar">
                <label>navigator</label>
                <div id="select_1" class="menu-select active" >
                    <i class="clock-icon"></i>
                    <h2>recent posts</h2>
                </div>
                <div id="select_2" class="menu-select" >
                    <i class="edit-icon"></i>
                    <h2>my posts</h2>
                </div>
                <div id="select_3" class="menu-select" >
                    <i class="heart-icon"></i>
                    <h2>liked posts</h2>
                </div>
            
                <label>categories</label>
                <ul class="categories">
                </ul>
            </div>
            <div class="main">
            </div>
            <div class="widget">
                <div class="section">
                    <h2 class="section-title">
                        <i class="star-icon"></i>
                        Must-read posts
                    </h2>
                    <ul>
                        <li><a href="#" target="_blank">Please read rules before you start using our platform</a></li>
                        <li><a href="https://www.paypal.com/paypalme/outiskteanas" target="_blank">Donate for 01Forum</a></li>
                    </ul>
                </div>
                <div class="section">
                    <h2 class="section-title">
                        <i class="link-icon"></i>
                        Featured links
                    </h2>
                    <ul>
                        <li><a href="https://github.com/ANAS-OU/go_forum" target="_blank">01Forum source-code on GitHub</a></li>
                        <li><a href="https://medium.com/@golangda/golang-quick-reference-top-20-best-coding-practices-c0cea6a43f20" target="_blank">Golang best-practices</a></li>
                        <li><a href="https://zone01oujda.ma/" target="_blank">Zone01-Oujda Company</a></li>
                    </ul>
                </div>
            </div>
        </div>
    
        <div id="loginPopup" class="popup">
            <div class="popup-content">
                <div>
                    <div id="sign" class="figure"></div>
                    <div>
                        <h2>sorry! your need to register first</h2>
                        <div class="sign">
                            <a href="/register" id="register"><i class="register-icon"></i>register</a>
                            <a href="/login" id="login"><i class="login-icon"></i>login</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    `

const data = {
    allPosts: [],
    allCategories: [],
    currentPage: 1,
    currentCommentsPage: 1,
    postsPerPage: 10,
    hasMore: true,
    hasMoreComments: true,
    currentView: 'recent',
    currentCategory: null,
};

// load post with its comments (pagination implemented)
const initCommentInfiniteScroll = (postId) => {
    const commentsContainer = document.querySelector('.comments');
    if (!commentsContainer) return;

    const observer = new IntersectionObserver((elem) => {
        if (elem[0].isIntersecting && data.hasMoreComments) {
            setTimeout(() => loadMoreComments(postId), 700);
        }
    }, {
        root: document.querySelector('.posts-container'),
        threshold: 0.1
    });

    const trigger = document.createElement('div');
    trigger.className = 'scroll-trigger';
    commentsContainer.appendChild(trigger);
    trigger.style.display = data.hasMoreComments ? 'block' : 'none';
    observer.observe(trigger);
};

const loadMoreComments = async (postId) => {
    const nextPage = ++data.currentCommentsPage;
    const post = await getPostData(postId, nextPage);
    data.hasMoreComments = post.hasMoreComments

    const commentsContainer = document.querySelector('.comments');
    post.comments.forEach(comment => {
        const commentDiv = createCommentElement(comment);
        commentsContainer.insertBefore(commentDiv, commentsContainer.lastElementChild);
    });

    const trigger = document.querySelector('.comments .scroll-trigger');
    if (trigger) {
        trigger.style.display = data.hasMoreComments ? 'block' : 'none';
    }

    currentPage = nextPage;
};

const getPostData = async (postId, page = 1) => {
    try {
        const response = await fetch(`/api/posts/${postId}?page=${page}`);
        const res = await response.json();

        if (response.ok) {
            return res
        } else {
            console.error(res.msg)
        }
    } catch (err) {
        console.error(err);
    }
}
let currentPage = 1;

const openPost = async (postId) => {
    currentPage = 1;
    const post = await getPostData(postId);
    data.hasMoreComments = post.hasMoreComments
    const postsContainer = document.querySelector('.posts-container');
    const widget = document.querySelector('.widget');
    const comments = document.createElement('div');
    const userId = parseInt(getCookie("user_id"));
    const likeActive = post.likes.includes(userId) ? ' liked' : ''
    const dislikeActive = post.dislikes.includes(userId) ? ' disliked' : ''

    comments.classList.add('comments');
    postsContainer.innerHTML = `
    <div class="post" data-id="${postId}">
        <div class="user-info">
            <img src="https://ui-avatars.com/api/?name=${post.by}" alt="User avatar" class="avatar">
            <div>
                <div class="username">${post.by}</div>
                <div class="timestamp">${timeAgo(new Date(post.createdAt).getTime())}</div>
            </div>
        </div>
        <div class="post-content">
            <h2>${filterContent(post.title)}</h2>
            <p>${filterContent(post.content)}</p>
        </div>
        <div class="tags-stats">
            <div class="tags">
                ${post.categories.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="post-stats">
                <div class="stat${likeActive}">
                    <i class="like-icon" onclick="likeAction(${post.id}, true)"></i><span>${post.likes.length}</span>
                </div>
                <div class="stat${dislikeActive}">
                    <i class="dislike-icon dislike" onclick="dislikeAction(${post.id}, true)"></i><span>${post.dislikes.length}</span>
                </div>
                <div class="stat">
                    <i class="comment-icon" onclick="openPost(${post.id})"></i><span>${post.totalComments}</span>
                </div>
            </div>
        </div>
    </div>

    <form id="commentForm" class="comment-box">
        <textarea class="comment-input" placeholder="Type here your wise suggestion" minlength="5" maxlength="500" required></textarea>
        <div class="button-group">
            <button class="btn btn-cancel">Cancel</button>
            <button class="btn btn-comment">
                <i class="comment-icon"></i>Comment
            </button>
        </div>
    </div>
    `

    widget.innerHTML = `
    <img src="https://ui-avatars.com/api/?name=${post.by}" alt="User avatar">
    <p class="username">@${post.by}</p>
    `

    for (const comment of post.comments) {
        const commentDiv = createCommentElement(comment);
        comments.append(commentDiv);
    }
    postsContainer.append(comments);

    document.querySelector('.btn-cancel').onclick = () => {
        document.querySelector('.comment-input').value = '';
    };
    document.getElementById('commentForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const commentArea = document.querySelector('.comment-input');
        const content = commentArea.value;
        commentArea.value = '';

        if (content.trim() == "") {
            commentArea.placeholder = 'Please type a valid comment ⚠'
            commentArea.style.setProperty('--placeholder-color', 'red');
            return
        }

        try {

            const response = await fetch("/newcomment", {
                method: "POST",
                body: JSON.stringify({ postId: parseInt(postId), content })
            })

            if (response.ok) {
                openPost(postId);
            } else {
                const res = await response.json();
                console.error(res.msg);
                document.getElementById("loginPopup").style.display = "block";
                if (res.code != 401) {
                    document.querySelector(".popup-content").innerHTML = `
                    <h2>Nice try!</h2>
                    <ul>
                        <li>${res.msg}</li>
                    </ul>
                    `
                }

            }
        } catch (err) {
            console.error(err)
        }
    })

    initCommentInfiniteScroll(postId);
}

// load all posts (pagination implemented)
const initInfiniteScroll = () => {
    const postsContainer = document.querySelector('.posts-container');
    if (!postsContainer) return;
    const observer = new IntersectionObserver((elem) => {
        if (elem[0].isIntersecting && data.hasMore) {
            setTimeout(() => loadMorePosts(), 1000);
        }
    }, {
        root: postsContainer,
        threshold: 0.1
    });

    const trigger = document.createElement('div');
    trigger.className = 'scroll-trigger';
    postsContainer.appendChild(trigger);
    trigger.style.display = data.hasMore ? 'block' : 'none';
    observer.observe(trigger);
};

const loadMorePosts = async () => {
    const postsContainer = document.querySelector('.posts-container');
    const nextPage = ++data.currentPage;
    await loadData(nextPage, false);

    data.allPosts.slice(-data.postsPerPage).forEach(post => {
        const postDiv = createPostElement(post);
        postsContainer.insertBefore(postDiv, postsContainer.lastElementChild);
    });
};

const loadData = async (page, resetData = false) => {
    if (resetData) {
        data.allPosts = [];
        data.currentPage = 1;
        data.hasMore = true;
    }

    if (!data.hasMore) return;

    try {
        let url = `/api/posts?page=${page}`;

        switch (data.currentView) {
            case 'created':
                url += `&filterBy=created`;
            case 'liked':
                url += `&filterBy=liked`;
            case 'category':
                url += `&filterBy=category&category=${data.currentCategory}`;
        }

        const response = await fetch(url);
        const result = await response.json();
        if (!response.ok) {
            console.error(result)
        }

        data.allPosts = resetData ? result.posts : [...data.allPosts, ...result.posts];
        data.hasMore = result.hasMore;
        const trigger = document.querySelector('.scroll-trigger');
        if (trigger) {
            trigger.style.display = data.hasMore ? 'block' : 'none';
        }
        data.currentPage = result.currentPage;
    } catch (error) {
        console.error('Error loading posts:', error);
    }
};

export const init = async () => {


    data.allCategories = await fetch("/api/categories")
        .then(response => response.json());

    const categContainer = document.querySelector('.categories');
    await loadData(1, true);
    for (const category of data.allCategories) {
        const categoryElem = document.createElement('li')
        categoryElem.id = category;
        categoryElem.onclick = () => filterByCategory(category);
        categoryElem.innerHTML = `
        <i class="hash-icon"></i>${category}
        `;
        categContainer.append(categoryElem);
    }
    displayPosts(data.allPosts);
    document.getElementById('select_1').classList.add('active');
};

const displayPosts = (posts) => {
    const main = document.querySelector('.main');
    const postsContainer = document.createElement('div');
    postsContainer.classList.add('posts-container');
    disactive();
    main.innerHTML = "";
    if (!posts || !posts.length) {
        main.innerHTML += `
        <img id="no_data" src="/assets/img/no_data.svg" alt="no result"/>
        `
    } else {
        for (const post of posts) {
            const postDiv = createPostElement(post);
            postsContainer.append(postDiv);
        }
        main.append(postsContainer);
    }

    initInfiniteScroll()
};

document.getElementById('select_1').onclick = () => recentPosts()

const recentPosts = async () => {
    data.currentView = 'recent';
    await loadData(1, true);
    widgetBack();
    displayPosts(data.allPosts);
    document.getElementById('select_1').classList.add('active');
};

document.getElementById('select_2').onclick = () => createdPosts()

const createdPosts = async () => {
    data.currentView = 'created';
    await loadData(1, true);
    widgetBack();
    displayPosts(data.allPosts);
    document.getElementById('select_2').classList.add('active');
};

document.getElementById('select_3').onclick = () => likedPosts()

const likedPosts = async () => {
    data.currentView = 'liked';
    await loadData(1, true);
    widgetBack();
    displayPosts(data.allPosts);
    document.getElementById('select_3').classList.add('active');
};

const filterByCategory = async (category) => {
    data.currentView = 'category';
    data.currentCategory = category;
    await loadData(1, true);
    widgetBack();
    displayPosts(data.allPosts);
    document.getElementById(category).classList.add('activeCat');
};

// const createPostElement = (post) => {
//     const userId = parseInt(getCookie("user_id"));
//     const postDiv = document.createElement("div");
//     const likeActive = post.likes.includes(userId) ? ' liked' : '';
//     const dislikeActive = post.dislikes.includes(userId) ? ' disliked' : '';

//     postDiv.dataset.id = post.id;
//     postDiv.classList.add("post");

//     postDiv.innerHTML = `
//         <div class="user-info">
//             <img src="https://ui-avatars.com/api/?name=${post.by}" alt="User avatar" class="avatar">
//             <div>
//                 <div class="username">${post.by}</div>
//                 <div class="timestamp">${timeAgo(new Date(post.createdAt).getTime())}</div>
//             </div>
//         </div>
//         <div class="post-content">
//             <h3 class="post-title">${filterContent(post.title)}</h3>
//             <p>${displayContent(post.content, post.id)}</p>
//         </div>
//         <div class="tags-stats">
//             <div class="tags">
//                 ${post.categories.map(tag => `<span class="tag">${tag}</span>`).join('')}
//             </div>
//             <div class="post-stats">
//                 <div class="stat${likeActive}">
//                     <i class="like-icon like"></i><span>${post.likes.length}</span>
//                 </div>
//                 <div class="stat${dislikeActive}">
//                     <i class="dislike-icon dislike"></i><span>${post.dislikes.length}</span>
//                 </div>
//                 <div class="stat">
//                     <i class="comment-icon"></i><span>${post.totalComments}</span>
//                 </div>
//             </div>
//         </div>
//     `;


//     const likeButton = postDiv.querySelector(".like");
//     const dislikeButton = postDiv.querySelector(".dislike");
//     const postTitle = postDiv.querySelector(".post-title");
//     const commentIcon = postDiv.querySelector(".comment-icon");

//     if (likeButton) {
//         likeButton.addEventListener("click", () => likeAction(post.id, true));
//     }

//     if (dislikeButton) {
//         dislikeButton.addEventListener("click", () => dislikeAction(post.id, true));
//     }

//     if (postTitle) {
//         postTitle.addEventListener("click", () => openPost(post.id));
//     }

//     if (commentIcon) {
//         commentIcon.addEventListener("click", () => openPost(post.id));
//     }
//     // console.log(postDiv)
//     return postDiv;
// };

const createPostElement = (post) => {
    const userId = parseInt(getCookie("user_id"));
    const postDiv = document.createElement("div");
    const likeActive = post.likes.includes(userId) ? ' liked' : '';
    const dislikeActive = post.dislikes.includes(userId) ? ' disliked' : '';

    postDiv.dataset.id = post.id;
    postDiv.classList.add("post");

    postDiv.innerHTML = `
        <div class="user-info">
            <img src="https://ui-avatars.com/api/?name=${post.by}" alt="User avatar" class="avatar">
            <div>
                <div class="username">${post.by}</div>
                <div class="timestamp">${timeAgo(new Date(post.createdAt).getTime())}</div>
            </div>
        </div>
        <div class="post-content">
            <h3 class="post-title">${filterContent(post.title)}</h3>
            <p>${displayContent(post.content, post.id)}</p>
        </div>
        <div class="tags-stats">
            <div class="tags">
                ${post.categories.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="post-stats">
                <div class="stat${likeActive}">
                    <i class="like-icon like"></i><span>${post.likes.length}</span>
                </div>
                <div class="stat${dislikeActive}">
                    <i class="dislike-icon dislike"></i><span>${post.dislikes.length}</span>
                </div>
                <div class="stat">
                    <i class="comment-icon"></i><span>${post.totalComments}</span>
                </div>
            </div>
        </div>
    `;

    reattachEventListeners(postDiv, post); // Attach event listeners initially
    return postDiv;
};

const reattachEventListeners = (postDiv, post) => {
    const likeButton = postDiv.querySelector(".like");
    const dislikeButton = postDiv.querySelector(".dislike");
    const postTitle = postDiv.querySelector(".post-title");
    const commentIcon = postDiv.querySelector(".comment-icon");

    if (likeButton) {
        likeButton.addEventListener("click", () => likeAction(post.id, true));
    }

    if (dislikeButton) {
        dislikeButton.addEventListener("click", () => dislikeAction(post.id, true));
    }

    if (postTitle) {
        postTitle.addEventListener("click", () => openPost(post.id));
    }

    if (commentIcon) {
        commentIcon.addEventListener("click", () => openPost(post.id));
    }
};

const displayContent = (content, id) => {
    if (content.match(/\n/g) && content.match(/\n/g).length < 3 && content.length < 200) {
        return filterContent(content)
    } else if (content.match(/\n/g) && content.match(/\n/g).length < 2 && content.length > 200) {
        return filterContent(content).slice(0, 200) + `... <span class="read-more" onclick="openPost(${id})">Read-More</span>`
    } else if (content.match(/\n/g) && content.match(/\n/g).length > 1) {
        return filterContent(content.split('\n')[0]).slice(0, 200) + `... <span class="read-more" onclick="openPost(${id})">Read-More</span>`
    } else if (content.length > 100) {
        return filterContent(content.split('\n')[0]).slice(0, 100) + `... <span class="read-more" onclick="openPost(${id})">Read-More</span>`
    } else {
        return filterContent(content)
    }
}

// const createCommentElement = (comment) => {
//     const userId = parseInt(getCookie("user_id"));
//     const commentDiv = document.createElement('div');
//     const likeActive = comment.likes.includes(userId) ? ' liked' : '';
//     const dislikeActive = comment.dislikes.includes(userId) ? ' disliked' : '';

//     commentDiv.dataset.id = comment.id;
//     commentDiv.classList.add('comment');

//     commentDiv.innerHTML = `
//         <div class="user-info">
//             <img src="https://ui-avatars.com/api/?name=${comment.by}" alt="User avatar" class="avatar">
//             <div>
//                 <div class="username">${comment.by}</div>
//                 <div class="timestamp">${timeAgo(new Date(comment.createdAt).getTime())}</div>
//             </div>
//         </div>
//         <div class="content">
//             <p>${filterContent(comment.content)}</p>
//         </div>
//         <div class="tags-stats">
//             <div class="post-stats">
//                 <div class="stat${likeActive}">
//                     <i class="like-icon"></i><span>${comment.likes.length}</span>
//                 </div>
//                 <div class="stat${dislikeActive}">
//                     <i class="dislike-icon dislike"></i><span>${comment.dislikes.length}</span>
//                 </div>
//             </div>
//         </div>
//     `;

//     // Add event listeners instead of inline onclick handlers
//     if (commentDiv) {
//         commentDiv.querySelector(".like-icon").addEventListener("click", () => likeAction(comment.id, false));
//         commentDiv.querySelector(".dislike-icon").addEventListener("click", () => dislikeAction(comment.id, false));
//     }

//     return commentDiv;
// };

const createCommentElement = (comment) => {
    const userId = parseInt(getCookie("user_id"));
    const commentDiv = document.createElement('div');
    const likeActive = comment.likes.includes(userId) ? ' liked' : '';
    const dislikeActive = comment.dislikes.includes(userId) ? ' disliked' : '';

    commentDiv.dataset.id = comment.id;
    commentDiv.classList.add('comment');

    commentDiv.innerHTML = `
        <div class="user-info">
            <img src="https://ui-avatars.com/api/?name=${comment.by}" alt="User avatar" class="avatar">
            <div>
                <div class="username">${comment.by}</div>
                <div class="timestamp">${timeAgo(new Date(comment.createdAt).getTime())}</div>
            </div>
        </div>
        <div class="content">
            <p>${filterContent(comment.content)}</p>
        </div>
        <div class="tags-stats">
            <div class="post-stats">
                <div class="stat${likeActive}">
                    <i class="like-icon like"></i><span>${comment.likes.length}</span>
                </div>
                <div class="stat${dislikeActive}">
                    <i class="dislike-icon dislike"></i><span>${comment.dislikes.length}</span>
                </div>
            </div>
        </div>
    `;

    // Attach event listeners to the comment's like and dislike buttons
    reattachCommentEventListeners(commentDiv, comment);

    return commentDiv;
};

const reattachCommentEventListeners = (commentDiv, comment) => {
    const likeButton = commentDiv.querySelector(".like");
    const dislikeButton = commentDiv.querySelector(".dislike");

    if (likeButton) {
        likeButton.addEventListener("click", () => likeAction(comment.id, false));
    }

    if (dislikeButton) {
        dislikeButton.addEventListener("click", () => dislikeAction(comment.id, false));
    }
};


const getPostId = () => {
    return document.querySelector('.post').dataset.id
}

const closedPost = () => {
    return document.querySelector('.comment-box') == undefined
}

// const likeAction = async (id, isPost) => {
//     console.log("here we listen")
//     const reqData = isPost ? { postId: id, isLike: true } : { commentId: id, isLike: true }
//     try {
//         const response = await fetch("/reaction", {
//             method: "POST",
//             body: JSON.stringify(reqData)
//         })
//         if (response.ok) {
//             if (isPost && closedPost()) {
//                 const post = await getPostData(id);
//                 const postDiv = document.querySelector(`.post[data-id="${id}"]`)
//                 postDiv.innerHTML = createPostElement(post).innerHTML;
//                 console.log('post like : ', post.id);
//                 return;
//             } else {
//                 const postId = getPostId();
//                 openPost(postId);
//                 return;
//             }
//         } else {
//             const res = await response.json();
//             console.error(res);
//             document.getElementById("loginPopup").style.display = "block";
//             return;
//         }
//     } catch (err) {
//         console.error(err)
//     }
// }
const likeAction = async (id, isPost) => {
    console.log("here we listen");
    const reqData = isPost ? { postId: id, isLike: true } : { commentId: id, isLike: true };
    try {
        const response = await fetch("/reaction", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reqData),
        });
        if (response.ok) {
            if (isPost && closedPost()) {
                const post = await getPostData(id);
                const postDiv = document.querySelector(`.post[data-id="${id}"]`);
                postDiv.innerHTML = createPostElement(post).innerHTML;
                reattachEventListeners(postDiv, post); // Reattach event listeners
                console.log('post like : ', post.id);
                return;
            } else {
                const postId = getPostId();
                openPost(postId);
                return;
            }
        } else {
            const res = await response.json();
            console.error(res);
            document.getElementById("loginPopup").style.display = "block";
            return;
        }
    } catch (err) {
        console.error(err);
    }
};
// const dislikeAction = async (id, isPost) => {
//     const reqData = isPost ? { postId: id, isDislike: true } : { commentId: id, isDislike: true }
//     try {
//         const response = await fetch("/reaction", {
//             method: "POST",
//             body: JSON.stringify(reqData)
//         })
//         if (response.ok) {
//             if (isPost && closedPost()) {
//                 const post = await getPostData(id);
//                 const postDiv = document.querySelector(`.post[data-id="${id}"]`)
//                 postDiv.innerHTML = createPostElement(post).innerHTML;
//             } else {
//                 const postId = getPostId();
//                 openPost(postId);
//             }
//         } else {
//             const res = await response.json();
//             console.error(res);
//             document.getElementById("loginPopup").style.display = "block";
//         }

//     } catch (err) {
//         console.error(err)
//     }
// }

const dislikeAction = async (id, isPost) => {
    const reqData = isPost ? { postId: id, isDislike: true } : { commentId: id, isDislike: true };
    try {
        const response = await fetch("/reaction", {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // Ensure the content type is set
            },
            body: JSON.stringify(reqData),
        });
        if (response.ok) {
            if (isPost && closedPost()) {
                const post = await getPostData(id);
                const postDiv = document.querySelector(`.post[data-id="${id}"]`);
                postDiv.innerHTML = createPostElement(post).innerHTML;
                reattachEventListeners(postDiv, post); // Reattach event listeners
            } else {
                const postId = getPostId();
                openPost(postId);
            }
        } else {
            const res = await response.json();
            console.error(res);
            document.getElementById("loginPopup").style.display = "block";
        }
    } catch (err) {
        console.error(err);
    }
};

const timeAgo = (time) => {
    const seconds = Math.floor(Date.now() - time) / 1000;
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
        }
    }
    return 'just now';
}

const escapeHtml = (unsafe) => {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

const filterContent = (content) => {
    return escapeHtml(content)
        .replace(/&lt;code&gt;/g, '<pre>')
        .replace(/&lt;\/code&gt;/g, '</pre>')
        .replace(/<pre>\n/g, '<pre>')
        .replace(/\n/g, '<br>')
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

const disactive = () => {
    const elems = [...document.querySelectorAll('.menu-select'), ...document.querySelectorAll('.categories>li')]
    for (const elem of elems) {
        elem.classList.remove('active');
        elem.classList.remove('activeCat');
    }

}

const widgetBack = () => {
    const widget = document.querySelector('.widget');
    widget.innerHTML = `
    <div class="section">
        <h2 class="section-title">
            <i class="star-icon"></i>
            Must-read posts
        </h2>
        <ul>
            <li><a href="#" target="_blank">Please read rules before you start using our platform</a></li>
            <li><a href="https://www.paypal.com/paypalme/outiskteanas" target="_blank">Donate for 01Forum</a></li>
        </ul>
    </div>
    <div class="section">
        <h2 class="section-title">
            <i class="link-icon"></i>
            Featured links
        </h2>
        <ul>
            <li><a href="https://github.com/ANAS-OU/go_forum" target="_blank">01Forum source-code on GitHub</a></li>
            <li><a href="https://medium.com/@golangda/golang-quick-reference-top-20-best-coding-practices-c0cea6a43f20" target="_blank">Golang best-practices</a></li>
            <li><a href="https://zone01oujda.ma/" target="_blank">Zone01-Oujda Company</a></li>
        </ul>
    </div>
    `
}

document.getElementById('logout').onclick = () => logout()

function logout() {
    fetch('/auth/logout', {
        method: 'POST',
        // You can add headers or other configuration here as needed
        headers: {
            'Content-Type': 'application/json',
        }
    })

        .then(response => response.json())  // Parse the JSON response
        .then(result => {
            if (result.redirected) {
                window.location.href = "/";  // Redirect if the response indicates a redirect
            }
        })

        .catch(error => {
            // console.error('Error during logout:', error);
            // alert('There was a problem logging out. Please try again later.');
            window.location.href = "/register"
        });
}


document.getElementById('create').onclick = () => newPost()

const newPost = () => {
    document.querySelector('.main').innerHTML = `
    <form id="newPostForm">
        <div class="multi-select">
            <div class="selected-tags" id="selectedTags" data-placeholder='Select categories (optional)'></div>
            <div class="dropdown" id="dropdown">
                <input type="text" class="search-box" placeholder="Search categories..." id="searchBox">
                <div class="select-all" id="selectAll">select all</div>
                <div class="options" id="options"></div>
            </div>
        </div>
        <input type="text" name="title" placeholder="Type catching attention title" required>
        <textarea name="content" placeholder="Type some content" minlength="10" maxlength="2000" required></textarea>
        <div class="button-container">
            <button class="btn btn-add-image">
                <i class="image-icon"></i>Add Image
            </button>
            <button class="btn btn-publish">
            <i class="send-icon"></i>Publish
            </button>
        </div>
    </form>
    `
    const tags = data.allCategories;
    let selectedTags = [];

    const selectedTagsContainer = document.getElementById('selectedTags');
    const dropdown = document.getElementById('dropdown');
    const searchBox = document.getElementById('searchBox');
    const optionsContainer = document.getElementById('options');
    const selectAllBtn = document.getElementById('selectAll');
    const newPostForm = document.getElementById('newPostForm');

    const renderTags = () => {
        selectedTagsContainer.innerHTML = selectedTags.map(tag => `
            <span class="tag">
                ${tag}
                <button class="tag-remove" data-tag="${tag}">×</button>
            </span>
        `).join('');

        const filteredTags = tags.filter(tag =>
            tag.toLowerCase().includes(searchBox.value.toLowerCase())
        );

        optionsContainer.innerHTML = filteredTags.map(tag => `
            <div class="dropdown-item ${selectedTags.includes(tag) ? 'selected' : ''}" data-tag="${tag}">
                ${tag}
            </div>
        `).join('');
    }

    selectedTagsContainer.addEventListener('click', () => {
        dropdown.classList.add('show');
    });

    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && !selectedTagsContainer.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });

    selectedTagsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('tag-remove')) {
            const tag = e.target.dataset.tag;
            selectedTags = selectedTags.filter(t => t !== tag);
            renderTags();
        }
    });

    optionsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('dropdown-item')) {
            const tag = e.target.dataset.tag;
            if (selectedTags.includes(tag)) {
                selectedTags = selectedTags.filter(t => t !== tag);
            } else {
                selectedTags.push(tag);
            }
            renderTags();
        }
    });

    searchBox.addEventListener('input', renderTags);

    selectAllBtn.addEventListener('click', () => {
        if (selectedTags.length === tags.length) {
            selectedTags = [];
        } else {
            selectedTags = [...tags];
        }
        renderTags();
    });

    newPostForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const title = document.querySelector('input[name="title"]').value;
        const content = document.querySelector('textarea[name="content"]').value;
        if (!title.trim() || !content.trim()) {
            document.getElementById("loginPopup").style.display = "block";
            document.querySelector(".popup-content").innerHTML = `
            <h2>Nice try!</h2>
            <ul>
                <li>The new post's title shouldn't be empty!</li>
                <li>The new post's content shouldn't be empty!</li>
            </ul>
            `
            return
        }
        try {
            const response = await fetch('/newpost', {
                method: 'POST',
                body: JSON.stringify({
                    Title: title,
                    Content: content,
                    Categories: selectedTags
                })
            })
            if (response.ok) {
                location.href = "/";
            } else {
                const res = await response.json();
                console.error(res);
                document.getElementById("loginPopup").style.display = "block";
                document.querySelector(".popup-content").innerHTML = `
                <h2>Nice try!</h2>
                <ul>
                    <li>${res.msg}</li>
                </ul>
                `
            }
        } catch (err) {
            console.error(err);
        }
    });

    renderTags();
}

const loginPopup = document.getElementById("loginPopup");
window.onclick = function (event) {
    if (event.target == loginPopup) {
        loginPopup.style.display = "none";
    }
};

