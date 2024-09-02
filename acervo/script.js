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
            
            const username = document.createElement('p');
            username.textContent = "@" + post.username;
            username.className = 'username';

            const ano_div = document.createElement('div');
            ano_div.className = 'ano-div';

            const ano = document.createElement('p');
            ano.textContent = post.ano;
            if (ano===0o0){
                ano = post.decada;
            }else if (ano===0o0 && ano==post.decada){
                ano =  post.seculo;
            }else if(ano==post.decada && ano===0o0){
                ano = "Desconhecido"
            }else if(ano==post.seculo && ano==19){
                ano = 'Século XIX'
            }else if(ano==post.seculo && ano==20){
                ano = 'Século XX'
            }

            const calendario = document.createElement('i');
            calendario.className = 'fa-regular fa-calendar-days';

            card.appendChild(img);
            card.appendChild(titulo);
            card.appendChild(username);
            card.appendChild(ano_div);
            ano_div.appendChild(calendario);
            ano_div.appendChild(ano);

            postsList.appendChild(card);
        });
    }else{
        console.log('erro', result.sql);
    }
});