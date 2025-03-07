export function Handleregister(){
    const page = document.querySelector(".zone")
    page.innerHTML = ""
    page.innerHTML = `
       <nav class="navbar">
        <a id="logo" href="/">
            <img id="logo-img" src="/assets/img/logo.svg" alt="">
            <span id="logo-name"><b>01</b>Forum</span>
        </a>
        <div class="sign">
            <a href="/login" id="login"><i class="login-icon"></i>login</a>
        </div>
    </nav>

    <div class="login-register grid_3-7">
        <div class="form-container">
            <h2>Join 01Forum community</h2>
            <p>Get more features and priviliges by joining to the most helpful community</p>
            <form id="registerForm">
                <input type="text" name="username" minlength="3" maxlength="20" placeholder="Username" required />
                <input type="email" name="email" minlength="6" maxlength="60" placeholder="Email" required />
                <div>
                    <input type="password" name="password" minlength="8" maxlength="20" placeholder="Password"
                        required />
                    <i class="eye-icon" onclick="togglePassword()"></i>
                </div>

                <button id="submit" type="submit">register</button>
            </form>
        </div>
        <div class="register showcase-img"></div>
        <link rel="stylesheet" href="/assets/css/register_login.css">
    </div>

    `
    document.getElementById("registerForm").addEventListener("submit", async function (e) {
        e.preventDefault();

        document.getElementById('errorMessage')?.remove()
        document.getElementById('success')?.remove()
        const form = document.querySelector('.form-container')
        const messageDiv = document.createElement('p')
        const email = document.querySelector("input[name='email']").value;
        const username = document.querySelector("input[name='username']").value;
        const password = document.querySelector("input[name='password']").value;

        try {
            const response = await fetch("/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, username, password }),
            })

            messageDiv.classList.add('message')
            if (response.ok) {
                messageDiv.id = 'success'
                messageDiv.textContent = 'Registered Successfully'
                setTimeout(() => location.href = "/", 700);
            } else {
                if (response.headers.get('content-type').includes('text/html')) {
                    document.innerHTML = response.text();
                } else {
                    messageDiv.id = 'errorMessage'
                    const result = await response.json();
                    console.error(result)
                    if (result.msg === 'Invalid password format') {
                        messageDiv.innerHTML = `Your password needs to:
                        <ul>
                            <li>Include both lower and upper case characters.</li>
                            <li>Include at least one number and symbol.</li>
                            <li>Password must be between 8 and 21 characters long.</li>
                        </ul>`
                    } else {
                        messageDiv.innerHTML = result.msg
                    }
                }
            }
            form.append(messageDiv)
        } catch (err) {
            console.error("Error during registration:", err);
        }
    });

    const togglePassword = () => {
        fieldPw = document.querySelector("input[name='password']");
        eye = document.querySelector('#registerForm i');
        if (fieldPw.type === 'password') {
            fieldPw.type = 'text';
            eye.classList = ['eye-off-icon'];
        } else {
            fieldPw.type = 'password';
            eye.classList = ['eye-icon'];
        }
    }

}