let button = document.getElementById('submit');

button.onclick = async function(){    
    let email = document.getElementById('email').value;
    let senha = document.getElementById('senha').value;
    let data = {email,senha}
    
    console.log("aqui")
    const response = await fetch('http://localhost:3000/api/store/login', {
        method: 'POST',
        headers: {'Content-type': "application/json;charset=UTF-8"},
        body: JSON.stringify(data)
    });

    console.log("aqui2")

    let content = await response.json();
    console.log(content)
    if(content.success){
        alert('Usuário logado.');
    }else{
        alert(content.msg);
    }
}