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
    
    console.log("aqui")
    const response = await fetch('http://localhost:3000/api/store/login', {
        method: 'POST',
        headers: {'Content-type': "application/json;charset=UTF-8"},
        body: JSON.stringify(data)
    });
    
    let content = await response.json();
    console.log(content)
    if(content.success){
        alert('Usuário logado.');
        localStorage.setItem('user', JSON.stringify(content.data))
        window.location.href = `../perfil/index.html?id=${params}`;
    }else{
        alert(content.msg);
    }
}

function toggle_password() {
    var x = document.getElementById("senha");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }