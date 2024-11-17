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
            request.body.sensitive_content === 'true' ? true : false, // Converte o conteúdo sensível para booleano
        ];

        const query = "INSERT INTO posts(user_id, titulo, descricao, img, ano, decada, seculo, pais, sensitive_content) VALUES(?,?,?,?,?,?,?,?,?)";

        connection.query(query, params, (err, results) => {
            if (results) {
                const postId = results.insertId; // id do post inserido
                const tags_front = request.body.tags.split(','); // Divide a string em um array. Exemplo: "família,escola" -> ['família', 'escola'] 

                // Verifica se as tags já existem no banco
                const query1 = "SELECT id, text FROM tags WHERE text IN (?)";
                connection.query(query1, [tags_front], (err, existingTags) => { // Se a query for bem sucedida, o banco de dados retorna um array de objetos, onde cada objeto representa uma tag existente. Exemplo: [{id: 1, text: 'família'}, {id: 2, text: 'escola'}]
                    if (err) {
                        console.log(err);
                        return response.status(500).json({
                            success: false,
                            message: "Erro ao verificar as tags.",
                        });
                    }

                    const existingTagsSet = new Set(existingTags.map(tag => tag.text)); // Cria um array com os textos das tags já existentes no banco e converte esse array em um conjunto (set), que armazena valores únicos (sem nada duplicado)
                    const existingTagIds = existingTags.map(tag => tag.id); // Cria um array com os ids das tags já existentes no banco

                    const newTags = tags_front.filter(tag => !existingTagsSet.has(tag));

                    // Filtra as tags enviadas pelo usuário para encontrar apenas as tags que ainda não existem no banco
                    // !existingTagsSet.has(tag): Verifica se o conjunto existingTagsSet não contém a tag atual. Se a tag não estiver no conjunto, ela será incluída no array newTags

                    const newTagsArray = newTags.map(tag => [tag]);

                    // Transforma o array newTags em um array de arrays. Cada tag é colocada em um sub array, o que é necessário para inserir várias tags no banco de dados usando um único comando sql.
                    // Exemplo: newTags = ['família', 'escola'] -> newTagsArray = [['família'], ['escola']]

                    const promises = [];

                    // O  array é usado para garantir que todas as operações assíncronas (a inserção das tags e a associação com o post) sejam resolvidas antes de continuar

                    if (newTags.length > 0) {
                        // Query para inserir novas tags no banco
                        const query2 = "INSERT INTO tags(text) VALUES ? ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)";

                        // Se uma tag já existir, o sql não vai inserir uma nova linha, mas sim executar a ação definida após ON DUPLICATE KEY
                        // UPDATE LAST_INSERT_ID(id): Retorna o id da tag existente. Assim, o código que executa a query pode usar o id retornado dessa operação, independente da tag ter sido realmente inserida

                        promises.push(new Promise((resolve, reject) => { // Cria uma promisse e a adiciona ao array promises. Essa promisse executa a query assíncrona no banco de dados
                            connection.query(query2, [newTagsArray], (err, results) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    // Calcula os ids das novas tags inseridas
                                    const newTagIds = results.insertId; // O banco retorna o id do primeiro registro inserido
                                    const insertedTagIds = Array.from({ length: results.affectedRows }, (_, i) => newTagIds + i); // results.affectedRows: O número de linhas afetadas pela query (o número de tags inseridas); newTagIds: Armazena o insertId, que é o id da primeira tag inserida (ou a id da tag existente se não for nova)
                                    resolve([...existingTagIds, ...insertedTagIds]); // Combina os ids das tags existentes (existingTagIds) com os ids das novas tags (insertedTagIds)
                                }
                            });
                        }));
                    } else {
                        // Se não há novas tags, resolve apenas com os ids existentes
                        promises.push(Promise.resolve(existingTagIds));
                    }

                    // Associa as tags ao post
                    Promise.all(promises).then(tagIds => {
                        linkPostTags(postId, tagIds.flat(), response); 
                        
                        // flat() é usado para achatar o array. Isso é necessário porque tagIds pode ser um array de arrays (se houver mais de uma promessa) e flat() converte em um único array
                        // Chama a função linkPostTags(), passando o postId e os ids das tags. Essa função é responsável por associar as tags ao post no banco de dados

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
                    message: "Erro ao criar o post.",
                    sql: err
                });
            }
        });
    });
}

// Função para vincular um post às suas tags no banco
function linkPostTags(postId, tagIds, response) {
    // Cria promessas para vincular cada tag ao post
    const linkQueries = tagIds.map(tagId => {
        return new Promise((resolve, reject) => {
            const query3 = "INSERT IGNORE INTO post_tags(post_id, tag_id) VALUES (?, ?)"; 

            // IGNORE: Se já existir uma relação entre o post_id e o tag_id (ou seja, se a combinação já estiver na tabela), o banco de dados ignora a inserção e não gera um erro

            connection.query(query3, [postId, tagId], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    });

    // Processa todas as associações
    Promise.all(linkQueries)
        .then(() => {
            response.status(201).json({
                success: true,
                message: "Post criado com sucesso!",
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

// Função para buscar posts com filtros dinâmicos
async function getPost(request, response) {
    const { titulo, ano, decada, seculo, pais, tags } = request.query;

    // Monta a query inicial
    let query = `
        SELECT p.*, u.username, u.instituicao
        FROM posts p
        JOIN users u ON u.id = p.user_id
        LEFT JOIN post_tags pt ON pt.post_id = p.id
        LEFT JOIN tags t ON t.id = pt.tag_id
        WHERE 1=1
    `;
 
    // JOIN users u ON u.id = p.user_id - Junta as informações de cada usuário com seus posts
    // LEFT JOIN post_tags pt ON pt.post_id = p.id - Retorna todos os registros da tabela à esquerda (posts), juntamente com os registros correspondentes da tabela à direita (post_tags). Se não houver correspondência na tabela da direita, o resultado ainda incluirá as linhas da tabela à esquerda, mas com valores null para as colunas da tabela à direita
    // LEFT JOIN tags t ON t.id = pt.tag_id -  Retorna todos os registros da tabela à esquerda (post_tags), juntamente com os dados correspondentes da tabela à direita (tags). Se não houver correspondência, o resultado incluirá null nas colunas da tabela tags
    // WHERE 1=1 - É redundante; serve pra que seja mais fácil adicionar as cláusulas de AND nos filtros depois

    // Aplica filtros com base nos parâmetros enviados
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

    query += " GROUP BY p.id"; // Usada para agrupar os resultados da consulta pelo id do post, evitando que o mesmo post apareça várias vezes no resultado
    query += " ORDER BY p.data_publicao DESC"; // Ordena por data de publicação decrescente

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

// Função para buscar tags
async function getTags(req, res) {
    const searchTerm = req.query.q;
    const query = "SELECT id, text FROM tags WHERE text LIKE ?";
    connection.query(query, [`%${searchTerm}%`], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar tags' });
        }
        res.json(results);
    });
}

// Função para buscar tags de um post específico
async function getTagsFromPost(req, res) {
    const { idpost } = req.body;
    const query = `
        SELECT t.text, pt.post_id, pt.tag_id 
        FROM post_tags AS pt
        INNER JOIN posts AS p ON p.id = pt.post_id
        INNER JOIN tags AS t ON t.id = pt.tag_id
        WHERE pt.post_id = ?`;

        // INNER JOIN posts AS p ON p.id = pt.post_id - Junção onde o id do post na tabela posts corresponde ao id do post na tabela post_tags
        // INNER JOIN tags AS t ON t.id = pt.tag_id -  Junção deve ser feita onde o id da tag na tabela tags corresponde ao is da tag na tabela post_tags

    connection.query(query, [idpost], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar tags' });
        }
        res.json(results);
    });
}

// Função para buscar um post pelo id
async function getPostById(request, response) {
    const postId = request.params.id;
    const query = `
        SELECT p.*, u.username, u.instituicao, GROUP_CONCAT(t.text) AS tags
        FROM posts p
        JOIN users u ON u.id = p.user_id
        LEFT JOIN post_tags pt ON pt.post_id = p.id
        LEFT JOIN tags t ON t.id = pt.tag_id
        WHERE p.id = ?
        GROUP BY p.id`;

        // GROUP_CONCAT(t.text) AS tags - Usada para concatenar as tags associadas ao post em uma única linha, separadas por vírgula
        // JOIN users u ON u.id = p.user_id - Traz os dados do usuário (nome de usuário e instituição) associados ao post
        // GROUP BY p.id - Como o GROUP_CONCAT está sendo usado para agregar as tags associadas a um post, a consulta tem que agrupar os resultados por p.id pra que todas as tags de um post sejam combinadas em uma única linha

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
