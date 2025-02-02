export class Home {
    constructor (){
    }

    init(){
        const page = document.getElementById('zone');
        page.innerHTML=''
        page.innerHTML=`
            <nav id="navbar">
        <h1>My App</h1>
        <a href="#" onclick="navigate('register')">Register</a>
    </nav>

    <!-- Main Layout -->
    <div id="app">
        <!-- Sidebar -->
        <aside id="sidebar">
        <h1>category-list<h1>
            <ul id="category-list">
        
            </ul>
         </aside>

        <main id="content">
            <h2>Welcome</h2>
            <p>Select a category to see posts.</p>
        </main>

        <section id="messages" style="display: none;">
            <h2>Messages</h2>
            <p>No new messages.</p>
        </section>
    </div>
        `
        // const content = document.getElementById('#content')
        // document.addEventListener("DOMContentLoaded", function() {
        //     fetchCategories();
        //     fetchPosts();
        // });
    }
}

// async function fetchCategories() {
//     const catgories = document.getElementById('id="category-list')
//     const response = await fetch("/auth/register", {
//         method : 'GET',
//         headers: {
//             "Content-Type": "application/json",
//             "Accept": "application/json",
//         },
//         // body : JSON.stringify({
//         //     Username : username,
//         //     Password :password,
//         //     Email : email,
//         // })
//        })
    
// }


// async function fetchCategories() {
    
// }





