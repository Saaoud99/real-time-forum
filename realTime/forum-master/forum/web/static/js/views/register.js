export class Register {
    constructor() {
    }

    init() {
        const page = document.getElementById('zone');
        page.innerHTML = '';
        page.innerHTML = `
            <div>
                <h2>Register</h2>
                <input type="text" id="username" placeholder="Username"><br><br>
                <input type="email" id="email" placeholder="Email"><br><br>
                <input type="password" id="password" placeholder="Password"><br><br>
                <button class="register" onclick="registerUser()">Submit</button>
            </div>

        `;
        const register  = document.querySelector('.register')
        
        
        register.addEventListener("click", ()=> {
           
           checkresponse()
        })



    }
}


async function checkresponse(){
    const username = document.getElementById('username').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
   const response = await fetch("/auth/register", {
    method : 'POST',
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
    body : JSON.stringify({
        Username : username,
        Password :password,
        Email : email,
    })
   })
   const data = await response.json()
   console.log(data);
   
   if (response.ok){
   main.redicrect("/login")
    
   }else{
    alert(data.msg)
    
   }
    
   
}







