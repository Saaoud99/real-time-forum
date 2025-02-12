export async function isAuthenticated() {
   // return document.cookie.includes('forum_session=');
    const res = await fetch('/user_id');
    if (!res.ok) {
        console.error('error fetching user id');
        return;
    }
     const user_id = await res.json();     
     return user_id.Val;
}
