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

async function getUserById(request, response) {
    const userId = request.params.id;

    const userQuery = "SELECT * FROM users WHERE id = ?";
    const postsQuery = `
        SELECT p.*, u.username 
        FROM posts p 
        JOIN users u ON p.user_id = u.id 
        WHERE u.id = ? 
        ORDER BY p.data_publicao DESC
    `;

    connection.query(userQuery, [userId], (err, userResults) => {
        if (err || userResults.length === 0) {
            return response.status(400).json({
                success: false,
                message: "Usuário não encontrado!",
                sql: err,
            });
        }

        connection.query(postsQuery, [userId], (err, postResults) => {
            if (err) {
                return response.status(500).json({
                    success: false,
                    message: "Erro ao buscar postagens do usuário.",
                    sql: err,
                });
            }

            response.status(200).json({
                success: true,
                data: {
                    user: userResults[0],
                    posts: postResults,
                },
                message: "Dados recuperados com sucesso!",
            });
        });
    });
}




module.exports = {
    storeLogin,
    getUserById
};
