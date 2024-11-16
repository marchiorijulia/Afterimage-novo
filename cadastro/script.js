let button = document.getElementById('submit');
const eye_button = document.getElementById('eye-icon');
const eye_button_confirm = document.getElementById('eye-icon-confirm');
const password_field = document.getElementById('senha');
const confirm_password = document.getElementById('confirmar-senha');


eye_button.addEventListener('click', () => {
    if (password_field.type === "password"){
        password_field.type = 'text';
        eye_button.classList.replace('fa-eye', 'fa-eye-slash');
    }else{
        password_field.type = 'password';
        eye_button.classList.replace('fa-eye-slash', 'fa-eye');
    }
});

eye_button_confirm.addEventListener('click', () => {
    if (confirm_password.type === "password"){
        confirm_password.type = 'text';
        eye_button_confirm.classList.replace('fa-eye', 'fa-eye-slash');
    }else{
        confirm_password.type = 'password';
        eye_button_confirm.classList.replace('fa-eye-slash', 'fa-eye');
    }
});

var check = function() {
    if (password_field.value == confirm_password.value && password_field.value !== "") {
      document.getElementById('message').style.color = 'var(--verde)';
      document.getElementById('message').innerHTML = 'As senhas estão iguais.';
    }else if(password_field.value === ""){
        document.getElementById('message').innerHTML = '';
    }else{
      document.getElementById('message').style.color = 'var(--vermelho)';
      document.getElementById('message').innerHTML = 'As senhas não estão iguais.';
    }
  }

button.onclick = async function(){
    let nome = document.getElementById('nome').value;
    let username = document.getElementById('username').value;
    let email = document.getElementById('email').value;
    let senha = document.getElementById('senha').value;
    let instituicao = document.getElementById('cbx-46').checked;
    let data = {nome,username,email,senha,instituicao}

    const response = await fetch('http://localhost:3000/api/store/cadastro', {
        method: 'POST',
        headers: {'Content-type': "application/json;charset=UTF-8"},
        body: JSON.stringify(data)
    });

    let content = await response.json();

    if(content.success){
        alert('Usuário cadastrado.');
        window.location.href = '../login/index.html';
    }else{
        alert('Ocorreu um erro');
    }
}