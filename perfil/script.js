document.addEventListener('DOMContentLoaded', function(){
    const urlParams = new URLSearchParams(window.location.search)

    const perfilId = urlParams.get("id")

    if (perfilId){
        fetch(`http://localhost:3000/api/get/users/perfil/${perfilId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success){
                const perfilMain = document.getElementById('main')
                perfilMain.innerHTML =
                `
                    <h2>${data.data.nome}</h2>
                    <p>Username: ${data.data.username}</p>
                `
            }else{
                const perfilMain = document.getElementById('main')
                perfilMain.innerHTML = "Não há perfil!"
            }
        })
    }
})
