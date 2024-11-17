// NAVBAR

document.addEventListener('DOMContentLoaded', function () {
    const loggedUser = JSON.parse(localStorage.getItem('user'));
    const botaoLogin = document.getElementById('botao-login');
    const botaoCadastro = document.getElementById('botao-cadastro');
    const botaoPerfil = document.getElementById('botao-perfil');
    const botaoLogout = document.getElementById('botao-logout');
    const botaoPostar = document.getElementById('botao-postar');

    if (loggedUser) {
        botaoLogin.style.display = 'none';
        botaoCadastro.style.display = 'none';

        botaoPerfil.classList.remove('hidden');
        botaoPerfil.href = `../perfil/index.html?id=${loggedUser.id}`;

        botaoLogout.classList.remove('hidden');

        botaoLogout.addEventListener('click', function () {
            localStorage.removeItem('user');
            alert('Você saiu da conta.');
            window.location.href = '../landing page/index.html';
        });
    } else {
        botaoPerfil.style.display = 'none';
        botaoLogout.style.display = 'none';

        botaoPostar.href = '../login/index.html';
    }
});

// FIM DA NAVBAR

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id"); 

    if (postId) {
        fetch(`http://localhost:3000/api/get/post/detalhes/${postId}`)
            .then(response => response.json())
            .then(data => {
                const section1 = document.querySelector('.section-1');
                const section2 = document.querySelector('.section-2');

                if (data.success) {
                    const post = data.data;
                    console.log(post)
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
                        checkIcon.className = 'fa-solid fa-circle-check';
                        usernameElement.appendChild(checkIcon);
                    }

                    // Adiciona o evento de clique no nome de usuário
                    usernameElement.addEventListener('click', function() {
                        window.location.href = `../perfil/index.html?id=${post.user_id}`;
                    });

                    let displayDate = "Desconhecido"; // Valor padrão
                    if (post.ano) {
                        displayDate = post.ano; 
                    } else if (post.decada) {
                        displayDate = `${post.decada}s`; 
                    } else if (post.seculo) {
                        displayDate = `Século ${post.seculo}`; 
                    }

                    // Formatação da data
                    const formattedDate = new Date(post.data_publicao).toLocaleDateString("pt-BR", {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    });

                    // Exibe as tags se houver
                    const tags = post.tags ? post.tags.split(',') : [];

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
                                <p>${post.pais || "Não informado."}</p>
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
