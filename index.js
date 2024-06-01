document.getElementById('fetch-posts').addEventListener('click', fetchPosts);

function fetchPosts() {
    Promise.all([
        fetch('https://jsonplaceholder.typicode.com/posts').then(response => response.json()),
        fetch('https://jsonplaceholder.typicode.com/users').then(response => response.json())
    ])
    .then(([posts, users]) => {
        const postsContainer = document.getElementById('posts-container');
        postsContainer.innerHTML = '';
        posts.forEach(post => {
            const user = users.find(user => user.id === post.userId);
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.body}</p>
                <p><strong>Author:</strong> ${user.name} (${user.email})</p>
            `;
            postElement.addEventListener('click', () => fetchPostDetails(post.id));
            postsContainer.appendChild(postElement);
        });
    })
    .catch(error => console.error('Error fetching posts:', error));
}

function fetchPostDetails(postId) {
    Promise.all([
        fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`).then(response => response.json()),
        fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`).then(response => response.json())
    ])
    .then(([post, comments]) => {
        const postsContainer = document.getElementById('posts-container');
        postsContainer.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.body}</p>
            <h3>Comments:</h3>
            <ul>
                ${comments.map(comment => `<li><strong>${comment.name}:</strong> ${comment.body} (${comment.email})</li>`).join('')}
            </ul>
            <button id="back">Back to Posts</button>
        `;
        document.getElementById('back').addEventListener('click', fetchPosts);
    })
    .catch(error => console.error('Error fetching post details:', error));
}