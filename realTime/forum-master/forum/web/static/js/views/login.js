export class Login {
    constructor() {
    }

    init() {
        const page = document.getElementById('zone');
        page.innerHTML = '';
        page.innerHTML = `
            <div style="text-align: center; margin-top: 50px;">
                <img src="web/static/img/bg/bg_1.jpg" alt="Logo" style="width: 150px; height: auto;">
                <form action="#" method="post">
                    <div>
                        <input type="text" name="username" placeholder="Username" required><br><br>
                    </div>
                    <div>
                        <input type="password" name="password" placeholder="Password" required><br><br>
                    </div>
                    <div>
                        <button type="submit">Login</button>
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

        
    }
}