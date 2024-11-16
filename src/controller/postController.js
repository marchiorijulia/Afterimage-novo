const connection = require('../config/db');
const dotenv = require('dotenv').config();

const fs = require('fs');
const path = require('path');

const uploadPath = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

async function storePost(request, response) {
    if (!request.files) {
        return response.status(400).json({
            success: false,
            message: "Você não enviou o arquivo de foto."
        });
    }

    const img = request.files.img;
    const imgNome = Date.now() + path.extname(img.name);

    img.mv(path.join(uploadPath, imgNome), (erro) => {
        if (erro) {
            return response.status(400).json({
                success: false,
                message: "Erro ao mover o arquivo."
            });
        }

        const params = [
            request.body.userId,
            request.body.titulo,
            request.body.descricao,
            imgNome,
            request.body.ano,
            request.body.decada,
            request.body.seculo,
            request.body.pais,
            request.body.sensitive_content === 'true' ? true : false,
        ];

        const query = "INSERT INTO posts(user_id, titulo, descricao, img, ano, decada, seculo, pais, sensitive_content) VALUES(?,?,?,?,?,?,?,?,?)";

        connection.query(query, params, (err, results) => {
            if (results) {
                const postId = results.insertId; // ID do post inserido
                const tags_front = request.body.tags.split(',');

                const query1 = "SELECT id, text FROM tags WHERE text IN (?)";
                connection.query(query1, [tags_front], (err, existingTags) => {
                    if (err) {
                        console.log(err);
                        return response.status(500).json({
                            success: false,
                            message: "Erro ao verificar as tags.",
                        });
                    }

                    const existingTagsSet = new Set(existingTags.map(tag => tag.text));
                    const existingTagIds = existingTags.map(tag => tag.id);

                    // Filtra as novas tags que ainda não existem
                    const newTags = tags_front.filter(tag => !existingTagsSet.has(tag));
                    const newTagsArray = newTags.map(tag => [tag]);

                    // Se houver novas tags, insira-as
                    const promises = [];
                    if (newTags.length > 0) {
                        const query2 = "INSERT INTO tags(text) VALUES ? ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)";
                        promises.push(new Promise((resolve, reject) => {
                            connection.query(query2, [newTagsArray], (err, results) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    // Recupera os IDs das novas tags inseridas
                                    const newTagIds = results.insertId; // Último ID inserido
                                    const insertedTagIds = Array.from({ length: results.affectedRows }, (_, i) => newTagIds + i);
                                    resolve([...existingTagIds, ...insertedTagIds]);
                                }
                            });
                        }));
                    } else {
                        promises.push(Promise.resolve(existingTagIds));
                    }

                    Promise.all(promises).then(tagIds => {
                        linkPostTags(postId, tagIds.flat(), response);
                    }).catch(err => {
                        console.log(err);
                        response.status(500).json({
                            success: false,
                            message: "Erro ao inserir novas tags.",
                        });
                    });
                });
            } else {
                console.log(err);
                response.status(400).json({
                    success: false,
                    message: "oops!",
                    sql: err
                });
            }
        });
    });
}

function linkPostTags(postId, tagIds, response) {
    const linkQueries = tagIds.map(tagId => {
        return new Promise((resolve, reject) => {
            const query3 = "INSERT IGNORE INTO post_tags(post_id, tag_id) VALUES (?, ?)";
            connection.query(query3, [postId, tagId], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    });

    Promise.all(linkQueries)
        .then(() => {
            response.status(201).json({
                success: true,
                message: "sucesso!",
                postId: postId
            });
        })
        .catch(err => {
            console.log(err);
            response.status(500).json({
                success: false,
                message: "Erro ao vincular post e tags.",
            });
        });
}




async function getPost(request, response) {
    const { titulo, ano, decada, seculo, pais, tags } = request.query;

    // A consulta inicial
    let query = `
        SELECT p.*, u.username, u.instituicao
        FROM posts p
        JOIN users u ON u.id = p.user_id
        LEFT JOIN post_tags pt ON pt.post_id = p.id
        LEFT JOIN tags t ON t.id = pt.tag_id
        WHERE 1=1
    `;

    // Adiciona filtros dinâmicos
    const queryParams = [];
    if (titulo) {
        query += " AND p.titulo LIKE ?";
        queryParams.push(`%${titulo}%`);
    }
    if (ano) {
        query += " AND p.ano = ?";
        queryParams.push(ano);
    }
    if (decada) {
        query += " AND p.decada = ?";
        queryParams.push(decada);
    }
    if (seculo) {
        query += " AND p.seculo = ?";
        queryParams.push(seculo);
    }
    if (pais) {
        query += " AND p.pais LIKE ?";
        queryParams.push(`%${pais}%`);
    }
    if (tags) {
        query += " AND t.text LIKE ?";
        queryParams.push(`%${tags}%`);
    }

    query += " GROUP BY p.id"; // Agrupar por post para evitar duplicados
    query += " ORDER BY p.data_publicao DESC"; // Ordenar pelos mais recentes

    connection.query(query, queryParams, (err, results) => {
        if (err) {
            return response.status(500).json({
                success: false,
                message: "Erro ao buscar posts.",
                error: err,
            });
        }

        response.status(200).json({
            success: true,
            data: results,
        });
    });
}



async function getTags(req, res) {
    const searchTerm = req.query.q;

    const query = "SELECT id, text FROM tags WHERE text LIKE ? LIMIT 10";
    connection.query(query, [`%${searchTerm}%`], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar tags' });
        }

        res.json(results); // Retorna as tags em formato JSON
    });
};

async function getTagsFromPost(req, res) {
    const { idpost } = req.body; // Recebendo o idpost do corpo da requisição

    const query = `
        SELECT t.text, pt.post_id, pt.tag_id 
        FROM post_tags AS pt
        INNER JOIN posts AS p ON p.id = pt.post_id
        INNER JOIN tags AS t ON t.id = pt.tag_id
        WHERE pt.post_id = ?`;

    connection.query(query, [idpost], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar tags' });
        } else {
            res.json(results); // Envia as tags encontradas
        }
    });
}

async function getPostById(request, response) {
    const postId = request.params.id;  // Pega o ID do post a partir da URL

    const query = `
        SELECT p.*, u.username, u.instituicao, GROUP_CONCAT(t.text) AS tags
        FROM posts p
        JOIN users u ON u.id = p.user_id
        LEFT JOIN post_tags pt ON pt.post_id = p.id
        LEFT JOIN tags t ON t.id = pt.tag_id
        WHERE p.id = ?
        GROUP BY p.id
    `;

    connection.query(query, [postId], (err, results) => {
        if (err) {
            return response.status(500).json({
                success: false,
                message: "Erro ao buscar o post.",
                error: err,
            });
        }

        if (results.length === 0) {
            return response.status(404).json({
                success: false,
                message: "Post não encontrado.",
            });
        }

        // Envia o post com as tags associadas e o campo instituicao
        response.status(200).json({
            success: true,
            data: results[0],
            message: "Post encontrado com sucesso!",
        });
    });
}



module.exports = {
    storePost,
    getPost,
    getTags,
    getTagsFromPost,
    getPostById
};