export function setuplayout(){
    if (!document.querySelector('.button-group')){
        
        const header = document.createElement('header');        
        header.className = 'button-group';
        header.innerHTML = `
        <h1>
        <img src="/frontend/img/home.png"  class="home-icon">  forum
        </h1>
        <button id="logout"  class="logedout" href="/logout" data-link>⏻ logout</button>
        <button id="newPost" class="logedout" href="/newPost" data-link>+ new post</button>
        `;
        document.getElementById('header').appendChild(header)
    }
}