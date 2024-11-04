{/* <form id="filterForm">
    <input type="text" id="filterTitle" placeholder="Título">
    <input type="number" id="filterYear" placeholder="Ano">
    <input type="text" id="filterUsername" placeholder="Username">
    <button type="submit">Filtrar</button>
</form>
<div class="posts-list"></div> */}

document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('http://localhost:3000/api/get/post');
    const result = await response.json();

    const postsList = document.querySelector('.posts-list');

    function displayPosts(posts) {
        postsList.innerHTML = ''; // Limpa a lista atual
        posts.forEach(post => {
            const card = document.createElement('div');
            card.className = 'postagem';

            const img = document.createElement('img');
            img.src = `http://localhost:3000/uploads/${post.img}`;
            img.className = 'img';

            const titulo = document.createElement('h1');
            titulo.textContent = post.titulo;

            const username = document.createElement('p');
            username.textContent = "@" + post.username;

            const ano_div = document.createElement('div');
            ano_div.className = 'ano-div';

            const ano = document.createElement('p');
            ano.textContent = post.ano || "Desconhecido"; // Default caso não tenha ano

            const calendario = document.createElement('i');
            calendario.className = 'fa-regular fa-calendar-days';

            ano_div.appendChild(calendario);
            ano_div.appendChild(ano);
            card.appendChild(img);
            card.appendChild(titulo);
            card.appendChild(username);
            card.appendChild(ano_div);

            postsList.appendChild(card);
        });
    }

    if (result.success) {
        displayPosts(result.data);

        document.getElementById('filterForm').addEventListener('submit', (e) => {
            e.preventDefault(); // Evita o comportamento padrão do formulário

            const title = document.getElementById('filterTitle').value.toLowerCase();
            const year = document.getElementById('filterYear').value;
            const username = document.getElementById('filterUsername').value.toLowerCase();

            const filteredPosts = result.data.filter(post => {
                return (!title || post.titulo.toLowerCase().includes(title)) &&
                       (!year || post.ano === Number(year)) &&
                       (!username || post.username.toLowerCase().includes(username));
            });

            displayPosts(filteredPosts);
        });
    } else {
        console.log('Erro', result.sql);
    }
});
