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

// async function teste() {
//     console.log($("#tags").val())
//     let options = $("#tags").val()
  
//     let tag_ids = []
//     let tag_text = []
  
//     options.forEach((tag) => {
//       if (isNaN(tag)) {
//         tag_text.push(tag)
//       } else {
//         tag_ids.push(tag)
//       }
//     })
  
//     let data = { id_user: 1, title: "teste", tag_ids, tag_text }
  
//     const response = await fetch('http://localhost:3339/post/salvar', {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(data)
//     })
  
//     const results = await response.json()
  
//     console.log(results)
//   }
  
  window.addEventListener('load', async () => {
    const response = await fetch('http://localhost:3339/tags/listar', {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
  
    const results = await response.json();
  
    console.log(results.data);
  
    if (results.success) {
      $('#tags').select2({
        tags: true,
        data: results.data,
        tokenSeparators: [','],
        placeholder: "Adicione suas tags...",
        selectOnClose: true,
        closeOnSelect: true
      });
    }
  })

// window.addEventListener("load", async () => {    
//     const response = await fetch('http://localhost:3000/api/tags/list', {
//         method: 'GET',
//         headers: {
//             "Content-Type":"application/json"
//         }
//     });

//     let content = await response.json();


//     if(content.success) {
//         let tags = content.data;
//         let tags_array = [];
        
    
//         tags.forEach(tag => {
//             tags_array.push(tag.tag_text)
//         });
    
//         let options = {
//             inputEl: "tagsInput2",
//             listEl: "tagsList2",
//             autocompleteSearchList: tags_array,        
//         };
//         var tagsInputWithSearch = new simpleTagsInput(options);
//         tagsInput.getTags();
//     }
// })

