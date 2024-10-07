const connection = require('../config/db');
const dotenv = require('dotenv').config();
const bcrypt = require('bcrypt');

async function storeCadastro(request, response){
    const params = Array(
        request.body.nome,
        request.body.username,
        request.body.email,
        bcrypt.hashSync(request.body.senha, 10),
        request.body.instituicao
    );

    const query = "INSERT INTO users(nome, username, email, senha, instituicao) VALUES(?,?,?,?,?)";

    connection.query(query, params, (err, results) => {
        if(results){

            // results[0].id

            // findIndex
            // includes
            // foreach e um if dentro

            
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
    storeCadastro
}