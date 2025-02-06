import { handleRoute } from "./main.js";

export const container = document.getElementById("container");

export function renderRegisterForm() {
    container.innerHTML = `
        <h2>Register</h2>
        <form id="registerForm">
          <input type="text" id="nickname" placeholder="Nickname" required><br>
          <input type="text" id="age" placeholder="Age" required><br>
            <div class="gender-group">
            <span class="gender-title">Gender</span>
            <label>
                <input type="radio" name="gender" value="male" required>
                <span>Male</span>
            </label>
            <label>
                <input type="radio" name="gender" value="female" required>
                <span>Female</span>
            </label>
        </div>
          <input type="text" id="firstName" placeholder="First Name" required><br>
          <input type="text" id="lastName" placeholder="Last Name" required><br>
          <input type="email" id="email" placeholder="Email" required><br>
          <input type="password" id="password" placeholder="Password" required><br>
          <button type="submit">Register</button>
        </form>
      `;

    document.getElementById("registerForm").addEventListener("submit", registerUser);
}

async function registerUser(event) {
    /*event.preventDefault(); is used here to stop the default form submission behavior
     of the browser, By default, when a form is submitted, the browser will:
     Collect all form data
     Create a GET or POST request
     Refresh/reload the page
     Append form data to the URL (in case of GET) or
    send it in the request body (in case of POST)
    */
    event.preventDefault();

    let user = {
        nickname: document.getElementById("nickname").value,
        age: document.getElementById("age").value,
        gender: document.querySelector('input[name="gender"]:checked')?.value || '', // Get selected radio value
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    let res = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    });
    console.log(res);

    if (res.ok) {
        history.pushState(null, null, '/');
        await handleRoute();
        return;
    }
    let data = await res.text();
    alert(data);
}