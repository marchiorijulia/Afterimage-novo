// NAVBAR

document.addEventListener('DOMContentLoaded', function () {
    const loggedUser = JSON.parse(localStorage.getItem('user'));
    const botaoLogin = document.getElementById('botao-login');
    const botaoCadastro = document.getElementById('botao-cadastro');
    const botaoPerfil = document.getElementById('botao-perfil');
    const botaoLogout = document.getElementById('botao-logout');
    const botaoPostar = document.getElementById('botao-postar');

    if (loggedUser) {
        // Remover botões de login e cadastro
        botaoLogin.style.display = 'none';
        botaoCadastro.style.display = 'none';

        // Mostrar botão de perfil e redirecionar ao perfil do usuário logado
        botaoPerfil.classList.remove('hidden');
        botaoPerfil.href = `../perfil/index.html?id=${loggedUser.id}`;

        // Mostrar o botão de logout
        botaoLogout.classList.remove('hidden');

        // Adicionar funcionalidade ao botão de logout
        botaoLogout.addEventListener('click', function () {
            localStorage.removeItem('user');
            alert('Você saiu da conta.');
            window.location.href = '../landing page/index.html';
        });
    } else {
        // Ocultar o botão de perfil e mostrar botões de login e cadastro
        botaoPerfil.style.display = 'none';
        botaoLogout.style.display = 'none';

        // Redirecionar o botão de postar para a página de login se não estiver logado
        botaoPostar.href = '../login/index.html';
    }
});

// FIM DA NAVBAR

let button = document.getElementById('submit');
let year = document.getElementById('year');
let decade = document.getElementById('decade');
let century = document.getElementById('century');

// Função para preencher a década e o século com base no ano
function preencherDecadaESeculo(ano) {
    if (ano === "00") {
        // Se o ano for "Desconhecido", limpa os campos
        decade.value = "00";
        century.value = "00";
        return;
    }

    // Calculando a década
    let decada = Math.floor(ano / 10) * 10;
    decade.value = decada;

    // Calculando o século
    let seculo = Math.ceil(ano / 100);
    century.value = seculo === 19 ? "19" : (seculo === 20 ? "20" : "00");
}

// Função que será chamada quando o ano for alterado
year.addEventListener('change', function () {
    let anoSelecionado = year.value;

    if (anoSelecionado !== "00") {
        // Preenche a década e o século com base no ano selecionado
        preencherDecadaESeculo(parseInt(anoSelecionado));
    }
});

// Função que será chamada quando a década for alterada
decade.addEventListener('change', function () {
    let decadaSelecionada = decade.value;

    if (decadaSelecionada !== "00" && year.value === "00") {
        // Calcula o século com base na década selecionada
        let anoDecada = parseInt(decadaSelecionada);
        let seculo = Math.floor(anoDecada / 100) + 1;
        century.value = seculo === 19 ? "19" : (seculo === 20 ? "20" : "00");
    }
});

// Populando o select de anos
for (let i = 1822; i <= 1999; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.innerHTML = i;
    year.appendChild(opt);
}

// Populando o select de décadas
for (let i = 1820; i <= 1990; i++) {
    if (i % 10 == 0) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = i;
        decade.appendChild(opt);
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
        language: "pt-BR",
        tags: true, // Permite que novas tags sejam adicionadas
        ajax: {
            url: 'http://localhost:3000/api/get/tags', // URL do seu endpoint para buscar as tags
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
}
