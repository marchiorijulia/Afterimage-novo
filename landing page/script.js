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