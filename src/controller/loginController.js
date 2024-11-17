const connection = require('../config/db');
require("dotenv").config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function storeLogin(request, response) {
    const query = "SELECT * FROM users WHERE email = ?";

    const params = [request.body.email];

    connection.query(query, params, (err, results) => {
        try {
            if (results.length > 0) {
                bcrypt.compare(request.body.senha, results[0].senha, (err, result) => {
                    if (err || !result) {
                        return response.status(401).send({
                            msg: 'Email ou senha estão incorretos!'
                        });
                    } else {
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
                    }
                });
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
    const userId = request.params.id; // Pega o id do usuário da url

    const userQuery = "SELECT * FROM users WHERE id = ?";

    const postsQuery = `
        SELECT p.*, u.username 
        FROM posts p 
        JOIN users u ON p.user_id = u.id 
        WHERE u.id = ? 
        ORDER BY p.data_publicao DESC
    `;

    // SELECT p.*, u.username - Seleciona todas as colunas da tabela "post" (denominada "p"); seleciona a coluna "username" da tabela "users"
    //     FROM posts p - É dado o nome real da tabela e sua abreviação
    //     JOIN users u ON p.user_id = u.id - Dá um join entre as tabelas "users" e "posts" onde o user_id for igual ao id do usuário
    //     WHERE u.id = ? - Aqui é inserido o id do usuário específico
    //     ORDER BY p.data_publicao DESC - Orderna os posts do usuário por data decrescente (mais recentes primeiro)

    // Busca os dados do usuário
    connection.query(userQuery, [userId], (err, userResults) => {
        if (err || userResults.length === 0) {
            return response.status(400).json({
                success: false,
                message: "Usuário não encontrado!",
                sql: err,
            });
        }

        // Busca os posts do usuário
        connection.query(postsQuery, [userId], (err, postResults) => {
            if (err) {
                return response.status(500).json({
                    success: false,
                    message: "Erro ao buscar postagens do usuário.",
                    sql: err,
                });
            }

            // Retorna os dados do usuário junto com seus posts
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

const fs = require('fs');
const path = require('path');

const uploadPath = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

async function updateUser(request, response) {
    const userId = request.params.id;
    const { nome, username, email, senha, descricao } = request.body; // Dados enviados na requisição
    let imgNome;

    // Verifica se uma imagem foi enviada na requisição
    if (request.files && request.files.img) {
        const img = request.files.img;
        imgNome = Date.now() + path.extname(img.name);
        img.mv(path.join(uploadPath, imgNome));
    }

    const query = `
        UPDATE users SET 
        nome = ?, username = ?, email = ?, senha = ?, descricao = ?, img = COALESCE(?, img)
        WHERE id = ?
    `;

    // img = COALESCE(?, img) - COALESCE retorna o primeiro valor não nulo - ou seja, se o valor fornecido ? seja null, o valor atual da coluna img será mantido. Se for enviada uma nova imagem, ela irá substituir a imagem existente.

    // Criptografa a nova senha se houver uma 
    const hashedPassword = senha ? await bcrypt.hash(senha, 10) : undefined; // Se ? for null, o valor resultante será undefined, evitando que uma senha inexistente seja processada
    const params = [nome, username, email, hashedPassword, descricao, imgNome, userId];

    connection.query(query, params, (err, results) => {
        if (err) {
            response.status(500).json({ success: false, message: "Erro ao atualizar perfil." });
        } else {
            response.status(200).json({ success: true, message: "Perfil atualizado com sucesso!" });
        }
    });
}

module.exports = {
    storeLogin,
    getUserById,
    updateUser
};
