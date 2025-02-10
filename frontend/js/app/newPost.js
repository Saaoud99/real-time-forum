import { handleRoute } from '../main.js'

const container = document.getElementById('container');


export function renderNewPost() {
  container.innerHTML = `
  <form id="newPostForm" >
      <h for="title">Title:</h>
      <input type="text" maxlength="50" id="title" name="title" required />

      <h for="content">Content:</h>
      <textarea id="content" maxlength="1000" name="content" rows="5" required></textarea>

      <!-- we change it to check box so the user can chose one or more categories -->
      <div>
      <div>
          <input type="checkbox" name="categories[]" value="tech" id="category-tech" />
          <label for="category-tech">Tech</label>
        </div>
        <div>
          <input type="checkbox" name="categories[]" value="science" id="category-science" />
          <label for="category-science">Science</label>
        </div>
        <div>
          <input type="checkbox" name="categories[]" value="sport" id="category-sport" />
          <label for="category-sport">Sport</label>
        </div>
      </div1>
      <button type="submit" id="createPostButton" class="create-post">Create Post</button>
      <button type="button" class="btn back-btn" href="/" data-link>Back to Home</button>
    </form>
    `;
  document.getElementById("newPostForm").addEventListener("submit", createNewPost);
}

async function createNewPost(event) {
  event.preventDefault();

  let selectedCategories = Array.from(document.querySelectorAll('input[name="categories[]"]:checked'))
    .map(checkbox => checkbox.value);

  let postData = {
    title: document.getElementById("title").value,
    content: document.getElementById("content").value,
    categories: selectedCategories
  };


  let res = await fetch("/newPost", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData)
  });

  if (res.ok) {
    history.pushState(null, null, '/');
    await handleRoute()
    return
  }

  let data = await res.text();
  alert(data);
}
