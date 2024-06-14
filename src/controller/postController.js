const connection = require('../config/db');
const dotenv = require('dotenv').config();

async function storePost(request, response){
    const params = Array(
        request.body.img,
        request.body.titulo,
        request.body.descricao,
        request.body.ano
    );

    const query = "INSERT INTO posts_simples(img, titulo, descricao, ano) VALUES(?,?,?,?)";

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

async function getPost(request, response){
    const query = "SELECT * FROM posts_simples";

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