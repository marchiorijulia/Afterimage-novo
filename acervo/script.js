document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch ('http://localhost:3000/api/get/post');
    const result = await response.json();

    console.log(result);
    if(result.success){
        const postsList = document.querySelector('.posts-list');
        result.data.forEach(post => {
            const card = document.createElement('div');
            card.className = 'postagem';

            const titulo = document.createElement('h1');
            titulo.textContent = post.titulo;
            
            const img = document.createElement('img');
            img.src = post.img;

            const descricao = document.createElement('p');
            descricao.textContent = post.descricao;

            const ano = document.createElement('p');
            ano.textContent = post.ano;

            card.appendChild(titulo);
            card.appendChild(img);
            card.appendChild(descricao);
            card.appendChild(ano);

            postsList.appendChild(card);
        });
    }else{
        console.log('erro', result.sql);
    }
});