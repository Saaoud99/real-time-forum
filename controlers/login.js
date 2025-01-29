console.log('ffffffffffff');

document.addEventListener("DOMContentLoaded", () => {
    const app = document.getElementById("app");
    
    // Clear existing content and add the login form
    app.innerHTML = `
      <h1>Login</h1>
      <form id="loginForm" class="login-form">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required />
        <br />
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required />
        <br />
        <button type="submit">Login</button>
      </form>
      <div id="errorMessage" style="color: red;"></div>
    `;
  
    // Add event listener for form submission
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault(); // Prevent page reload
  
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
  
      try {
        // Send login data to the backend
        const response = await fetch(`${API_HOST_NAME}/api/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
  
        if (!response.ok) {
          throw new Error("Invalid credentials");
        }
  
        const data = await response.json();
        alert("Login successful!");
        console.log("JWT Token:", data.token);
  
        // Redirect or load other content
        app.innerHTML = `<h1>Welcome, ${username}!</h1>`;
      } catch (error) {
        document.getElementById("errorMessage").textContent = error.message;
      }
    });
  });
  