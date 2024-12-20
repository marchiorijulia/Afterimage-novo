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

let button = document.getElementById('submit');
const eye_button = document.getElementById('eye-icon');
const password_field = document.getElementById('senha');

eye_button.addEventListener('click', () => {
    if (password_field.type === "password"){
        password_field.type = 'text';
        eye_button.classList.replace('fa-eye', 'fa-eye-slash');
    }else{
        password_field.type = 'password';
        eye_button.classList.replace('fa-eye-slash', 'fa-eye');
    }
});

button.onclick = async function(){    
    let email = document.getElementById('email').value;
    let senha = document.getElementById('senha').value;
    let data = {email,senha}
    
    const response = await fetch('http://localhost:3000/api/store/login', {
        method: 'POST',
        headers: {'Content-type': "application/json;charset=UTF-8"},
        body: JSON.stringify(data)
    });
    
    let content = await response.json();

    if(content.success){
        alert('Usuário logado.');
        localStorage.setItem('user', JSON.stringify(content.data))
        window.location.href = `../perfil/index.html?id=${content.data.id}`;
    }else{
        alert(content.msg);
    }
}

function toggle_password() {
    const x = document.getElementById("senha");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }