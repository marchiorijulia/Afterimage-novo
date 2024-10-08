const connection = require('../config/db');
const dotenv = require('dotenv').config();

const fs = require('fs');
const path = require('path');

const uploadPath = path.join(__dirname, "..", "uploads");

if(!fs.existsSync(uploadPath)){
    fs.mkdirSync(uploadPath);
}

async function storePost(request, response){

    


    
    

    if(!request.files){
        return response.status(400).json({
            success: false,
            message: "Você não enviou o arquivo de foto."
        });
    }

    const img = request.files.img;
    const imgNome = Date.now() + path.extname(img.name);

    img.mv(path.join(uploadPath, imgNome), (erro) => {
        if(erro){
            return response.status(400).json({
                success: false,
                message: "Erro ao mover o arquivo."
            })
        }

        const params = Array(
            request.body.userId,
            request.body.titulo,
            request.body.descricao,
            imgNome,
            request.body.ano,
            request.body.decada,
            request.body.seculo,
            request.body.country,
            request.body.sensitive_content == 'true' ? true : false,
        )

        const query = "INSERT INTO posts(user_id, titulo, descricao, img, ano, decada, seculo, pais, sensitive_content) VALUES(?,?,?,?,?,?,?,?,?)";

        connection.query(query, params, (err, results) => {
            if(results){
                
                const tags_array = []
                const tags_front = request.body.tags.split(',')
                tags_front.forEach((tag) => {
                    let tag_array = []
                    tag_array.push(tag)
                    tags_array.push(tag_array)
                })
                console.log(tags_array)
                
                const query2 = "REPLACE INTO tags(text) VALUES ?"
                
                connection.query(query2, [tags_array], (err, results) => {
                    if(results){
                        console.log(results)
                    } else {
                        console.log(err)
                    }
                })

                response
                .status(201)
                .json({
                    success: true,
                    message: "sucesso!",
                    data: results
                })
            }else{
                console.log(err)
                response
                .status(400)
                .json({
                    success: false,
                    message: "oops!",
                    sql: err
                })
            }
        })

    });
}

async function getPost(request, response){
    const query = "SELECT * FROM posts, users where users.id = posts.user_id";

    connection.query(query, (err, results) => {
        if(results){
            response
            .status(201)
            .json({
                success: true,
                message: "sucesso!",
                data: results
            })
        }else{
            response
            .status(400)
            .json({
                success: false,
                message: "oops!",
                sql: err
            })
        }
    })
}

module.exports = {
    storePost,
    getPost
};