document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const perfilId = urlParams.get("id");

    if (perfilId) {
        fetch(`http://localhost:3000/api/get/users/perfil/${perfilId}`)
            .then(response => response.json())
            .then(data => {
                const perfilMain = document.getElementById('main');

                if (data.success) {
                    const user = data.data.user;
                    const posts = data.data.posts;

                    // Cabeçalho do perfil
                    const profileHeader = `
                        <section class="profile-header">
                            <img src="../Images/pfp placeholder.jpg" alt="Foto do perfil" id="profile-picture">
                            <div class="profile-header-details">
                                <h1>${user.nome}</h1>
                                <p id="username">
                                    @${user.username}
                                    ${user.instituicao ? '<i class="fa-solid fa-circle-check"></i>' : ''}
                                </p>
                                <p id="desc">${user.descricao || "Descrição não fornecida."}</p>
                            </div>
                        </section>
                        <hr>
                        <section class="posts-list">
                        </section>
                    `;

                    perfilMain.innerHTML = profileHeader; // Insere o cabeçalho

                    // Renderizar postagens
// Renderizar postagens
const postsList = perfilMain.querySelector('.posts-list');
if (posts.length > 0) {
    posts.forEach(post => {
        let displayDate = "Desconhecido"; // Valor padrão
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

        // Verifica se o perfil é de uma instituição e adiciona o ícone
        if (user.instituicao) { // Usa o valor do perfil atual
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

                } else {
                    perfilMain.innerHTML = "<p>Perfil não encontrado.</p>";
                }
            })
            .catch(error => {
                console.error("Erro ao carregar perfil:", error);
            });
    }
});
