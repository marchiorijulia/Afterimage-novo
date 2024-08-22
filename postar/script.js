let button = document.getElementById('submit');
let year = document.getElementById('year');
let decade = document.getElementById('decade');
let century = document.getElementById('century');

for (let i = 1822; i <= 1999; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.innerHTML = i;
    year.appendChild(opt);
}

for (let i = 1820; i <= 1990; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.innerHTML = i;
    decade.appendChild(opt);
}

button.onclick = async function () {
    let form = document.getElementById('formulario');
    let dadosForm = new FormData(form); //cria agrupado de dados

    const response = await fetch('http://localhost:3000/api/store/post', {
        method: 'POST',
        body: dadosForm
    });

    let content = await response.json();

    if (content.success) {
        alert('Postado com sucesso!')
    } else {
        alert('Ocorreu um erro');
    }
}