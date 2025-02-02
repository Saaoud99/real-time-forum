import main from "../main.js"
export class Login {
    constructor() {
    }

    init() {
        const page = document.getElementById('zone');
        page.innerHTML = '';
        page.innerHTML = `
            <div style="text-align: center; margin-top: 50px;">
                <img src="web/static/img/bg/bg_1.jpg" alt="Logo" style="width: 150px; height: auto;">
               
                    <div>
                        <input type="text" id="username" name="username" placeholder="Username" required><br><br>
                    </div>
                    <div>
                        <input type="password" name="password" id="password" placeholder="Password" required><br><br>
                    </div>
                    <div>
                        <button class="login" onclick="LoginUser()"=>Login</button>
                    </div>
                </form>

                <!-- Link or Button to go to Register page -->
                <div style="margin-top: 20px;">
                    <a href="/register" style="font-size: 14px; color: blue;">Don't have an account? Register here</a>
                    <!-- OR you could use a button -->
                    <!-- <button id="registerBtn">Register</button> -->
                </div>
            </div>
        `;

        const login = document.querySelector('.login')

        login.addEventListener('click', ()=>{
            checklogin()
        })
        
    }
}

async function checklogin(){
    const username = document.getElementById('username').value
    //const email = document.getElementById('email').value
    const password = document.getElementById('password').value
   const response = await fetch("/auth/login", {
    method : 'POST',
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
    body : JSON.stringify({
        Username : username,
        Password :password,
        //Email : email,
    })
   })
   const data = await response.json()
   console.log(data);
   
   if (response.ok){
    main.redicrect("/")
   }else{
    alert(data.msg)
    
   }
}
