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
    
    let tags = $("#tags").select2("data");

    const joinedStr = tags.map((tag) => tag.text).join()


    dadosForm.append('userId', usuario.id)
    dadosForm.append('tags', joinedStr)

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


$(document).ready(function() {
    $('.select2Tags').select2({
        placeholder: "Selecione ou digite uma tag",
        tags: true, // Permite que novas tags sejam adicionadas
        ajax: {
            url: '/api/get/tags', // URL do seu endpoint para buscar as tags
            dataType: 'json',
            delay: 250,
            data: function(params) {
                return {
                    q: params.term // O termo de pesquisa digitado
                };
            },
            processResults: function(data) {
                return {
                    results: data.map(tag => {
                        return { id: tag.id, text: tag.text }; // Formato esperado pelo Select2
                    })
                };
            },
            cache: true
        },
        minimumInputLength: 1 // Número mínimo de caracteres para iniciar a busca
    });
});

// $("#tags").select2({
//     maximumInputLength: 5
// });