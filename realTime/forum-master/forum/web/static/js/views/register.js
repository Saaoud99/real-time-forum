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
                <button onclick="registerUser()">Submit</button>
            </div>
        `;

    }
}







