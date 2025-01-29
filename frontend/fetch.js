const apiUrl = 'http://localhost:8080/posts'

async function fetchPosts(){
    try{

        const response = await fetch (apiUrl)
    
        if (!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`)
        }
    
        const posts = await response.json()

        displayPosts(posts);

    } catch (error){
        console.error('Error fetching posts:', error)
    }


}

function displayPosts(posts) {
    const postsContainer = document.getElementById('app'); 
    postsContainer.innerHTML = ''; 

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.content}</p>
            <small>Posted by User ID: ${post.user_id} on ${new Date(post.created_at).toLocaleString()}</small>
        `;
        postsContainer.appendChild(postElement);
    });
}