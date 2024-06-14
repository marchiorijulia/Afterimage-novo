const connection = require('../config/db');
const dotenv = require('dotenv').config();

async function storeTask(request, response){
    const params = Array(
        request.body.nome,
        request.body.username,
        request.body.email,
        request.body.senha
    );

    const query = "INSERT INTO users(nome, username, email, senha) VALUES(?,?,?,?)";

    connection.query(query, params, (err, results) => {
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

<<<<<<< HEAD
module.exports = {
    storeTask
=======
async function storePost(request, response){
    const params = Array(
        request.body.img,
        request.body.titulo,
        request.body.descricao,
        request.body.ano
    );

    const query = "INSERT INTO posts(img, titulo, descricao, ano) VALUES(?,?,?,?)";

    connection.query(query, params, (err, results) => {
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
    storeTask,
    storePost
>>>>>>> fd3e9e72dcd8aa70484fb34c9b1e1e07f52ecdba
}