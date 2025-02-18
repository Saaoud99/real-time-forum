export function setuplayout(){
    if (!document.querySelector('#button-group')){
        
        const header = document.createElement('header');  
        header.id = 'button-group';
        header.className = 'button-group';
        header.innerHTML = `

        <button id="logout"  class="logedout" href="/logout" data-link>⏻ logout</button>
        <button id="newPost" class="logedout" href="/newPost" data-link>+ new post</button>
        `;

        const h = document.createElement('h1');
        h.id = 'forum';
        h.innerHTML = `
        <img src="/frontend/img/home.png"  class="home-icon">  forum
        `;

        document.getElementById('header').appendChild(h)
        document.getElementById('header').appendChild(header)
     }
}