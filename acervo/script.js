// NAVBAR

document.addEventListener('DOMContentLoaded', function () {
    const loggedUser = JSON.parse(localStorage.getItem('user'));
    const botaoLogin = document.getElementById('botao-login');
    const botaoCadastro = document.getElementById('botao-cadastro');
    const botaoPerfil = document.getElementById('botao-perfil');
    const botaoLogout = document.getElementById('botao-logout');
    const botaoPostar = document.getElementById('botao-postar');

    if (loggedUser) {
        // Remover botões de login e cadastro
        botaoLogin.style.display = 'none';
        botaoCadastro.style.display = 'none';

        // Mostrar botão de perfil e redirecionar ao perfil do usuário logado
        botaoPerfil.classList.remove('hidden');
        botaoPerfil.href = `../perfil/index.html?id=${loggedUser.id}`;

        // Mostrar o botão de logout
        botaoLogout.classList.remove('hidden');

        // Adicionar funcionalidade ao botão de logout
        botaoLogout.addEventListener('click', function () {
            localStorage.removeItem('user');
            alert('Você saiu da conta.');
            window.location.href = '../landing page/index.html';
        });
    } else {
        // Ocultar o botão de perfil e mostrar botões de login e cadastro
        botaoPerfil.style.display = 'none';
        botaoLogout.style.display = 'none';

        // Redirecionar o botão de postar para a página de login se não estiver logado
        botaoPostar.href = '../login/index.html';
    }
});

// FIM DA NAVBAR

document.addEventListener('DOMContentLoaded', async () => {
    const postsList = document.querySelector('.posts-list');
    const filterForm = document.getElementById('filterForm');

    // Função para buscar posts com os filtros
    async function fetchFilteredPosts(filters) {
        const sensitiveContentFilter = document.getElementById('filterSensitiveContent').checked;

        // Se o filtro de conteúdo sensível estiver ativado, adiciona o parâmetro para ocultar posts sensíveis
        if (sensitiveContentFilter) {
            filters.sensitive_content = false; // Filtra posts com conteúdo sensível
        }

        // Faz a requisição com os filtros
        const response = await fetch(`http://localhost:3000/api/get/post?${new URLSearchParams(filters)}`);
        const result = await response.json();

        if (result.success) {
            displayPosts(result.data);
        } else {
            console.log('Erro ao buscar posts filtrados');
        }
    }

    // Função para exibir os posts na interface
    function displayPosts(posts) {
        console.log(posts)
        postsList.innerHTML = ''; // Limpa os posts anteriores
        posts.forEach(post => {
            // Se o post for marcado como sensível e o filtro estiver ativado, não exibe
            if (post.sensitive_content && document.getElementById('filterSensitiveContent').checked) {
                return; // Ignora este post
            }

            const card = document.createElement('div');
            card.className = 'postagem';
            card.style.cursor = "pointer";
            card.addEventListener("click", function(){
                window.open(`../foto detalhes/index.html?id=${post.id}`, '_blank');
            })

            const img = document.createElement('img');
            img.src = `http://localhost:3000/uploads/${post.img}`;
            img.className = 'img';

            const titulo = document.createElement('h1');
            titulo.textContent = post.titulo;
            titulo.className = 'titulo';

            const username = document.createElement('p');
            username.className = 'username';

            // Exibe o nome de usuário
            username.textContent = "@" + post.username;

            // Verifica se o usuário é uma instituição e adiciona o ícone
            if (post.instituicao == 1) {
                const checkIcon = document.createElement('i');
                checkIcon.className = 'fa-solid fa-circle-check'; // Adiciona a classe do ícone
                username.appendChild(checkIcon); // Adiciona o ícone ao lado do nome de usuário
            }

            const ano_div = document.createElement('div');
            ano_div.className = 'ano-div';

            const ano = document.createElement('p');

            // Lógica para exibir ano, década ou século
            let displayDate = "Desconhecido"; // Valor padrão
            if (post.ano) {
                displayDate = post.ano; // Exibe o ano se disponível
            } else if (post.decada) {
                displayDate = `${post.decada}s`; // Exibe a década se disponível
            } else if (post.seculo) {
                displayDate = `Século ${post.seculo}`; // Exibe o século se disponível
            }

            ano.textContent = displayDate;

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
    }

    // Quando o formulário de filtro for enviado
    filterForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Previne o comportamento padrão de envio do formulário

        // Captura os valores dos filtros
        const filters = {
            titulo: document.getElementById('filterTitle').value.toLowerCase(),
            ano: document.getElementById('filterYear').value,
            decada: document.getElementById('filterDecade').value,
            seculo: document.getElementById('filterCentury').value,
            pais: document.getElementById('filterCountry').value.toLowerCase(),
            tags: document.getElementById('filterTags').value.toLowerCase(),
        };

        // Remove filtros vazios
        for (const key in filters) {
            if (!filters[key]) delete filters[key];
        }

        // Chama a função para buscar os posts filtrados
        fetchFilteredPosts(filters);
    });

    // Inicializa a busca com todos os posts
    fetchFilteredPosts({});
});
