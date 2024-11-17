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
    const perfilId = urlParams.get("id");

    // Verifica se o usuário está logado
    const loggedUser = JSON.parse(localStorage.getItem('user'));

    if (perfilId) {
        fetch(`http://localhost:3000/api/get/users/perfil/${perfilId}`)
            .then(response => response.json())
            .then(data => {
                const perfilMain = document.getElementById('main');

                if (data.success) {
                    const user = data.data.user;
                    const posts = data.data.posts;
                    const profilePictureSrc = user.img ? `http://localhost:3000/uploads/${user.img}` : "../Images/pfp placeholder.jpg";

                    // Verificar se o perfil visualizado pertence ao usuário logado
                    const isUserLoggedIn = loggedUser && loggedUser.id === user.id;

                    // Profile header com ícone de edição condicional
                    const profileHeader = `
                        <section class="profile-header">
                            <img src="${profilePictureSrc}" alt="Foto do perfil" id="profile-picture">
                            <div class="profile-header-details">
                                <h1>${user.nome}
                                    ${isUserLoggedIn ? '<i class="fa-regular fa-pen-to-square edit-icon" id="edit-profile-icon"></i>' : ''}
                                </h1>
                                <p id="username">
                                    @${user.username}
                                    ${user.instituicao ? '<i class="fa-solid fa-circle-check"></i>' : ''}
                                </p>
                                <p id="desc">${user.descricao || "Descrição não fornecida."}</p>
                            </div>
                        </section>
                        <hr>
                        <section class="posts-list"></section>
                        <div id="edit-profile-form" class="overlay hidden">
                            <form class="edit-form">
                                <h2>Editar Perfil</h2>
                                <label for="edit-name">Nome:</label>
                                <input type="text" id="edit-name" name="nome" value="${user.nome}">
                                
                                <label for="edit-username">Username:</label>
                                <input type="text" id="edit-username" name="username" value="${user.username}">
                                
                                <label for="edit-email">Email:</label>
                                <input type="email" id="edit-email" name="email" value="${user.email}">
                                
                                <label for="edit-password">Senha:</label>
                                <input type="password" id="edit-password" name="senha">
                                
                                <label for="edit-desc">Descrição:</label>
                                <textarea id="edit-desc" name="descricao">${user.descricao || ""}</textarea>
                                
                                <label for="edit-img">Imagem de perfil:</label>
                                <input type="file" id="edit-img" name="img">
                                
                                <button type="submit">Salvar</button>
                                <button type="button" id="cancel-edit">Cancelar</button>
                            </form>
                        </div>
                    `;

                    perfilMain.innerHTML = profileHeader;

                    // Criar as postagens
                    const postsList = perfilMain.querySelector('.posts-list');
                    if (posts.length > 0) {
                        posts.forEach(post => {
                            let displayDate = "Desconhecido";
                            if (post.ano) {
                                displayDate = post.ano;
                            } else if (post.decada) {
                                displayDate = `${post.decada}s`;
                            } else if (post.seculo) {
                                displayDate = `Século ${post.seculo}`;
                            }

                            const postDiv = document.createElement('div');
                            postDiv.className = 'postagem';
                            postDiv.style.cursor = "pointer";
                            postDiv.addEventListener("click", function () {
                                window.open(`../foto detalhes/index.html?id=${post.id}`, '_blank');
                            });

                            const postImage = document.createElement('img');
                            postImage.src = `http://localhost:3000/uploads/${post.img}`;
                            postImage.alt = "Imagem do post";
                            postImage.className = 'img';

                            const postTitle = document.createElement('h1');
                            postTitle.textContent = post.titulo;

                            const postUsername = document.createElement('p');
                            postUsername.className = 'username';
                            postUsername.textContent = "@" + post.username;

                            if (user.instituicao) {
                                const checkIcon = document.createElement('i');
                                checkIcon.className = 'fa-solid fa-circle-check';
                                postUsername.appendChild(checkIcon);
                            }

                            const postYearDiv = document.createElement('div');
                            postYearDiv.className = 'ano-div';
                            const postYear = document.createElement('p');
                            postYear.textContent = displayDate;

                            const calendarIcon = document.createElement('i');
                            calendarIcon.className = 'fa-regular fa-calendar-days';

                            postYearDiv.appendChild(calendarIcon);
                            postYearDiv.appendChild(postYear);

                            postDiv.appendChild(postImage);
                            postDiv.appendChild(postTitle);
                            postDiv.appendChild(postUsername);
                            postDiv.appendChild(postYearDiv);

                            postsList.appendChild(postDiv);
                        });
                    } else {
                        postsList.innerHTML = `<p>Este usuário ainda não fez postagens.</p>`;
                    }

                    // Adicionar funcionalidade de exibição/ocultação do formulário se o usuário estiver logado
                    if (isUserLoggedIn) {
                        const editIcon = document.getElementById('edit-profile-icon');
                        const editForm = document.getElementById('edit-profile-form');
                        const cancelEditButton = document.getElementById('cancel-edit');
                        const profilePicture = document.getElementById('profile-picture');
                        const editImgInput = document.getElementById('edit-img');

                        editIcon.addEventListener('click', function () {
                            editForm.classList.remove('hidden');
                        });

                        cancelEditButton.addEventListener('click', function () {
                            editForm.classList.add('hidden');
                        });

                        // Visualizar imagem selecionada
                        editImgInput.addEventListener('change', function () {
                            const file = editImgInput.files[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = function (e) {
                                    profilePicture.src = e.target.result;
                                };
                                reader.readAsDataURL(file);
                            }
                        });

                        // Submissão do formulário de edição
                        editForm.querySelector('form').addEventListener('submit', function (e) {
                            e.preventDefault();
                            const formData = new FormData(this);
                            formData.append('id', perfilId);

                            fetch(`http://localhost:3000/api/update/users/${perfilId}`, {
                                method: 'PUT',
                                body: formData
                            })
                            .then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                    alert("Perfil atualizado com sucesso!");
                                    window.location.reload();
                                } else {
                                    alert("Erro ao atualizar o perfil.");
                                }
                            })
                            .catch(error => {
                                console.error("Erro na atualização do perfil:", error);
                            });
                        });
                    }

                } else {
                    perfilMain.innerHTML = "<p>Perfil não encontrado.</p>";
                }
            })
            .catch(error => {
                console.error("Erro ao carregar perfil:", error);
            });
    }
});
