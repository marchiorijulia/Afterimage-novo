async function tagsPost(idpost) {
    const responseTags = await fetch('http://localhost:3000/api/get/tags/post', {
        method: 'POST', // Assumindo que você está enviando o ID via POST
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idpost }) // Passando o id do post no corpo da requisição
    });
    const tagsresult = await responseTags.json();
    return tagsresult; // Retorna as tags para cada post
}

document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('http://localhost:3000/api/get/post');
    const result = await response.json();

    const postsList = document.querySelector('.posts-list');
    console.log(result);

    let i = 1
    async function displayPosts(posts) {
        postsList.innerHTML = ''; // Limpa a lista atual
        for (let post of posts) {
            // Aguarda as tags de cada post
            const tags = await tagsPost(i);
            console.log(tags);

            const card = document.createElement('div');
            card.className = 'postagem';

            const img = document.createElement('img');
            img.src = `http://localhost:3000/uploads/${post.img}`;
            img.className = 'img';

            const titulo = document.createElement('h1');
            titulo.textContent = post.titulo;
            titulo.className = '.postagem h1';

            const username = document.createElement('p');
            username.textContent = "@" + post.username;
            username.className = 'username';

            const ano_div = document.createElement('div');
            ano_div.className = 'ano-div';

            const ano = document.createElement('p');
            ano.textContent = post.ano || "Desconhecido";

            const calendario = document.createElement('i');
            calendario.className = 'fa-regular fa-calendar-days';

            card.appendChild(img);
            card.appendChild(titulo);
            card.appendChild(username);
            card.appendChild(ano_div);
            ano_div.appendChild(calendario);
            ano_div.appendChild(ano);

            postsList.appendChild(card);

            // Exemplo de como adicionar tags ao card
            const tagsDiv = document.createElement('div');
            tagsDiv.className = 'tags';
            tags.forEach(tag => {
                // const tagElem = document.createElement('span');
                // tagElem.textContent = tag.text;
                // tagsDiv.appendChild(tagElem);
            });
            card.appendChild(tagsDiv);

            postsList.appendChild(card);
            i++
        }
    }

    if (result.success) {
        displayPosts(result.data);

        document.getElementById('filterForm').addEventListener('submit', (e) => {
            e.preventDefault(); // Evita o comportamento padrão do formulário

            const title = document.getElementById('filterTitle').value.toLowerCase();
            const year = document.getElementById('filterYear').value;
            const username = document.getElementById('filterUsername').value.toLowerCase();
            const pais = document.getElementById('filterCountry').value.toLowerCase();

            const filteredPosts = result.data.filter(post => {
                return (!title || post.titulo.toLowerCase().includes(title)) &&
                       (!year || post.ano === Number(year)) &&
                       (!username || post.username.toLowerCase().includes(username)) &&
                       (!pais || post.pais.toLowerCase().includes(pais));
            });

            // Aqui você pode aplicar o filtro nas tags, por exemplo:
            const filteredPostsWithTags = filteredPosts.filter(post => {
                return tagsPost(post.id).then(tags => {
                    // Aqui você pode implementar a lógica de filtro nas tags
                    return tags.some(tag => tag.text.toLowerCase().includes('tagDesejada'));
                });
            });

            // Exibe os posts filtrados
            displayPosts(filteredPostsWithTags);
        });
    } else {
        console.log('Erro', result.sql);
    }
});
