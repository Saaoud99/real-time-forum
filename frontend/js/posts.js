const app = document.getElementById('app')
const container = document.getElementById('container')
export async function fetchPost() {
    try {
        const res = await fetch('/posts');
        if (!res.ok) {
            console.log('error fetching posts');
            return;
        }
        const posts = await res.json();
        posts.forEach(post => {
            const postCard = document.createElement('div')
            postCard.className = 'postCard'
            postCard.innerHTML = ``
            container.appendChild(postCard)            
        });
    } catch {

    }
}