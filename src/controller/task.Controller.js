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

module.exports = {
    storeTask
}