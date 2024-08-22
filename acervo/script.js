document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch ('http://localhost:3000/api/get/post');
    const result = await response.json();

    console.log(result);
    if(result.success){
        const postsList = document.querySelector('.posts-list');
        result.data.forEach(post => {
            const card = document.createElement('div');
            card.className = 'postagem';

            const img = document.createElement('img');
            img.src = `http://localhost:3000/uploads/${post.img}`;
            img.className = 'img';

            const titulo = document.createElement('h1');
            titulo.textContent = post.titulo;
            titulo.className = '.postagem h1';
            
            const descricao = document.createElement('p');
            descricao.textContent = post.descricao;
            descricao.className = 'desc';

            const ano_div = document.createElement('div');
            ano_div.className = 'ano_div';

            const ano = document.createElement('p');
            ano.textContent = post.ano;

            const calendario = document.createElement('i');
            calendario.className = 'fa-solid fa-calendar-days';

            card.appendChild(img);
            card.appendChild(titulo);
            card.appendChild(descricao);
            card.appendChild(ano_div);
            ano_div.appendChild(calendario);
            ano_div.appendChild(ano);

            postsList.appendChild(card);
        });
    }else{
        console.log('erro', result.sql);
    }
});