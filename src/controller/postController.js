const connection = require('../config/db');
const dotenv = require('dotenv').config();

const fs = require('fs');
const path = require('path');

const uploadPath = path.join(__dirname, "..", "uploads");

if(!fs.existsSync(uploadPath)){
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
            request.body.country,
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

async function getTags(req, res){
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

module.exports = {
    storePost,
    getPost,
    getTags
};