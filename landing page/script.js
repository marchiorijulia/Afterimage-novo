let user = localStorage.getItem('user')
let btnlogin = document.getElementById('botao-login')
let btnCadastro = document.getElementById('botao-cadastro')

if(user){
    console.log(user);
    btnlogin.style.display = 'none';
    btnCadastro.style.display = 'none';
}