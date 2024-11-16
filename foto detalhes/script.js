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

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id"); // Pega o ID do post da URL

    if (postId) {
        // Faz a requisição para obter os detalhes do post
        fetch(`http://localhost:3000/api/get/post/detalhes/${postId}`)
            .then(response => response.json())
            .then(data => {
                const section1 = document.querySelector('.section-1');
                const section2 = document.querySelector('.section-2');

                if (data.success) {
                    const post = data.data;
                    console.log(post)
                    // Preenche o cabeçalho do post (section-1)
                    section1.innerHTML = `
                        <a class="pag-inicial" href="../acervo/index.html">
                            <i class="fa-solid fa-chevron-left"></i>
                            <p>Voltar ao acervo</p>
                        </a>
                        <h2>${post.titulo}</h2>
                        <p id="username">@${post.username}</p>
                    `;

                    // Verifica se o usuário é uma instituição e adiciona o ícone
                    const usernameElement = document.getElementById('username');
                    if (post.instituicao == 1) {
                        const checkIcon = document.createElement('i');
                        checkIcon.className = 'fa-solid fa-circle-check'; // Adiciona a classe do ícone
                        usernameElement.appendChild(checkIcon); // Adiciona o ícone ao lado do nome de usuário
                    }

                    // Adiciona o evento de clique no nome de usuário
                    usernameElement.addEventListener('click', function() {
                        // Redireciona para a página de perfil do usuário
                        window.location.href = `../perfil/index.html?id=${post.user_id}`;
                    });

                    // Preenche os detalhes do post (section-2)
                    let displayDate = "Desconhecido"; // Valor padrão
                    if (post.ano) {
                        displayDate = post.ano; // Exibe o ano se disponível
                    } else if (post.decada) {
                        displayDate = `${post.decada}s`; // Exibe a década se disponível
                    } else if (post.seculo) {
                        displayDate = `Século ${post.seculo}`; // Exibe o século se disponível
                    }

                    // Formatação da data
                    const formattedDate = new Date(post.data_publicao).toLocaleDateString("pt-BR", {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    });

                    // Exibe as tags, se houver
                    const tags = post.tags ? post.tags.split(',') : [];

                    // Preenche os detalhes do post (section-2)
                    section2.innerHTML = `
                        <img src="http://localhost:3000/uploads/${post.img}" alt="${post.titulo}" id="postImage">
                        <div class="section-2-sub">
                            <div class="informacoes" id="desc-div">
                                <p><b>Descrição:</b></p>
                                <p>${post.descricao || "Sem descrição disponível."}</p>
                            </div>
                            <div class="informacoes">
                                <p><b>Data:</b></p>
                                <p>${displayDate}</p>
                            </div>
                            <div class="informacoes">
                                <p><b>País:</b></p>
                                <p>${post.pais || "Não informado"}</p>
                            </div>
                            <div class="all-tags-div">
                                <p><b>Tags:</b></p>
                                ${tags.map(tag => `
                                    <div class="tag-div">
                                        <i class="fa-solid fa-tags"></i>
                                        <p>${tag}</p>
                                    </div>
                                `).join('')}
                            </div>
                            <p id="timestamp">Publicado em: ${formattedDate}</p>
                        </div>
                    `;

                    // Adiciona o evento de clique na imagem
                    const postImage = document.getElementById('postImage');
                    postImage.addEventListener('click', function() {
                        // Abre a imagem em uma nova guia
                        window.open(`http://localhost:3000/uploads/${post.img}`, '_blank');
                    });

                } else {
                    section1.innerHTML = `<p>Post não encontrado.</p>`;
                    section2.innerHTML = "";
                }
            })
            .catch(error => {
                console.error("Erro ao carregar os detalhes do post:", error);
                const section1 = document.querySelector('.section-1');
                section1.innerHTML = `<p>Erro ao carregar os detalhes do post.</p>`;
            });
    } else {
        const section1 = document.querySelector('.section-1');
        section1.innerHTML = `<p>ID do post não fornecido.</p>`;
    }
});
