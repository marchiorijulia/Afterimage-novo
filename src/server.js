const app = require('./app');
const port = app.get('port');

const express = require('express')
const cors = require('cors')
require('dotenv').config()
const swaggerUi = require("swagger-ui-express")
const swaggerJsDoc = require('swagger-jsdoc')

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API Afterimage',
            version: '1.0.0',
            description: 'Rotas utilizadas no Afterimage',
        },
        servers: [{ url: 'http://localhost:3003'}],
    },
    apis: [`${__dirname}/routes/*.js`],
};

const cadastroRouter = require('./routes/cadastroRouter');
const postRouter = require('./routes/postRouter');
const loginRouter = require('./routes/loginRouter');
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
app.use(express.json())
app.use(cors())
app.use('/api', cadastroRouter);
app.use('/api', postRouter);
app.use('/api', loginRouter);


app.listen(port, () => console.log(`run on port ${port}!`));
