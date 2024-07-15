let button = document.getElementById('submit');

button.onclick = async function(){
    let nome = document.getElementById('nome').value;
    let username = document.getElementById('username').value;
    let email = document.getElementById('email').value;
    let senha = document.getElementById('senha').value;
    let data = {nome,username,email,senha}

    const response = await fetch('http://localhost:3000/api/store/cadastro', {
        method: 'POST',
        headers: {'Content-type': "application/json;charset=UTF-8"},
        body: JSON.stringify(data)
    });

    let content = await response.json();

    if(content.success){
        alert('Usuário cadastrado.')
    }else{
        alert('Ocorreu um erro');
    }
}