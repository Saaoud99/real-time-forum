import main from "../main.js"
export class Login {
    constructor() {
    }

    init() {
        const page = document.getElementById('zone');
        page.innerHTML = '';
        page.innerHTML = `
             <noscript>
        <div class="nojs-popup">
            <div class="spinner-container">
                <div class="spinner-wrap">
                    <h2 id="nojs">You need to enable JavaScript to run this app.</h2>
                    <div class="spinner"></div>
                    <div class="spinner-text">Loading...</div>
                </div>
            </div>
        </div>
    </noscript>

    <nav class="navbar">
        <a id="logo" href="/">
            <img id="logo-img" src="/assets/img/logo.svg" alt="">
            <span id="logo-name"><b>01</b>Forum</span>
        </a>
        <div class="sign">
            <a href="/register" id="register"><i class="register-icon"></i>register</a>
        </div>
    </nav>

    <div class="login-register grid_3-7">
        <div class="form-container">
            <h2>We've missed you!</h2>
            <p>More than 120 questions are waiting for your wise suggestions!</p>
            <form id="loginForm">
                <input type="text" name="username" minlength="3" maxlength="60" placeholder="Username or Email"
                    required />
                <div>
                    <input type="password" name="password" minlength="8" maxlength="20" placeholder="Password"
                        required />
                    <i class="eye-icon" onclick="togglePassword()"></i>
                </div>

                <button id="submit" type="submit">login</button>
            </form>
        </div>
        <div class="login showcase-img"></div>
    </div>

        `;
        
        const togle = document.querySelector("eye-icon")

        togle.onclick()= () =>{
            togglePassword();
        }

        document.getElementById("loginForm").addEventListener("submit", async function (e) {
            e.preventDefault();

            document.getElementById('errorMessage')?.remove()
            document.getElementById('success')?.remove()
            const form = document.querySelector('.form-container')
            const messageDiv = document.createElement('p')
            const username = document.querySelector("input[name='username']").value;
            const password = document.querySelector("input[name='password']").value;
            const errorMessage = document.getElementById("errorMessage");

            try {
                const response = await fetch("/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, password }),
                });

                messageDiv.classList.add('message')
                if (response.ok) {
                    messageDiv.id = 'success'
                    messageDiv.textContent = 'Logged in Successfully'
                    setTimeout(() => location.href = "/", 700); // Redirect to home page after successful login
                } else {
                    if (response.headers.get('content-type').includes('text/html')) {
                        document.innerHTML = response.text();
                    } else {
                        const result = await response.json();
                        console.error("Login failed:", result.msg);
                        console.error(result)
                        messageDiv.id = 'errorMessage'
                        messageDiv.textContent = 'Username or Password Incorrect'
                    }
                }
                form.append(messageDiv)
            } catch (err) {
                console.error("Error during login:", err);
            }
        });

        const togglePassword = () => {
            fieldPw = document.querySelector("input[name='password']");
            eye = document.querySelector('#loginForm i');
            if (fieldPw.type === 'password') {
                fieldPw.type = 'text';
                eye.classList = ['eye-off-icon'];
            } else {
                fieldPw.type = 'password';
                eye.classList = ['eye-icon'];
            }
        }

        // const login = document.querySelector('.login')

        // login.addEventListener('click', ()=>{
        //     checklogin()
        // })
        
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
