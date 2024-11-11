let perfil = document.getElementById('perfil-button')
let user = localStorage.getItem('user')

if (user) {
    perfil.getAttribute("href");
    perfil.setAttribute("href", `../perfil/index.html?id=${perfil.data.id}`);
} else {
    perfil.href = '../cadastro/index.html'
}