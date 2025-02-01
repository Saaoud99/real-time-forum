export const app = document.getElementById("app");

export function renderRegisterForm() {
    app.innerHTML = `
        <h2>Register</h2>
        <form id="registerForm">
          <input type="text" id="nickname" placeholder="Nickname" required><br>
          <input type="text" id="age" placeholder="Age" required><br>
          <input type="text" id="gender" placeholder="Gender" required><br>
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
    event.preventDefault();

    let user = {
        nickname: document.getElementById("nickname").value,
        age: document.getElementById("age").value,
        gender: document.getElementById("gender").value,
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
    if (res.ok) {
        history.pushState(null, null, '/');
    }
    let data = await res.text();
    alert(data);
}