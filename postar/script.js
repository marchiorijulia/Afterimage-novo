let button = document.getElementById('submit');
let year = document.getElementById('year');
let decade = document.getElementById('decade');

for (let i = 1822; i <= 1999; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.innerHTML = i;
    year.appendChild(opt);
}

for (let i = 1820; i <= 1990; i++) {
    if (i % 10 == 0) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = i;
        decade.appendChild(opt);
    }
}

button.onclick = async function () {
    let form = document.getElementById('formulario');
    let dadosForm = new FormData(form); 
    let usuario = JSON.parse(localStorage.getItem('user'));

    dadosForm.append('userId', usuario.id)
    //cria agrupado de dados

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

$(".select2Tags").each(function(index, element) {
  $(this).select2({
    tags: true,
    width: "100%" // just for stack-snippet to show properly
  });
});