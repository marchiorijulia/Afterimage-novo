let button = document.getElementById('submit');

button.onclick = async function(){
    let img = document.getElementById('img').value;
    let titulo = document.getElementById('titulo').value;
    let descricao = document.getElementById('descricao').value;
    let ano = document.getElementById('ano').value;
    let data = {img,titulo,descricao,ano}

    const response = await fetch('http://localhost:3000/api/store/post', {
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