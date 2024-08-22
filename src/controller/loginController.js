const connection = require('../config/db');
require("dotenv").config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


async function storeLogin(request, response) {
    const query = "SELECT * FROM users WHERE email = ?";

    const params = Array(
        request.body.email
    );

    connection.query(query, params, (err, results) => {
        try {
            if (results.length > 0) {
                bcrypt.compare(request.body.senha, results[0].senha, (err, result) => {
                    if (err) {
                        return response.status(401).send({
                            msg: 'Email ou senha estão incorretos!'
                        });
                    } else if (result) {
                        const userData = results[0];
                        const userId = userData.id;
                        const token = jwt.sign(
                            { userId },
                            'token',
                            { expiresIn: 300 }
                        );
                        userData['token'] = token;

                        response
                            .status(200)
                            .json({
                                success: true,
                                message: `Sucesso! Usuário conectado.`,
                                data: userData
                            });
                    } else {
                        return response.status(401).send({
                            msg: 'Email ou senha estão incorretos!'
                        });
                    }
                })

            } else {
                return response.status(401).send({
                    msg: 'Email não cadastrado.'
                });
            }
        } catch (e) {
            response.status(400).json({
                succes: false,
                message: "Ocorreu um erro.",
                query: err,
                sqlMessage: err
            });
        }
    });
}

module.exports = {
    storeLogin
}