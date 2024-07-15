const express = require('express');
const dotenv = require('dotenv').config();
const cadastroRouter = require('./routes/cadastroRouter');
const postRouter = require('./routes/postRouter');
const loginRouter = require('./routes/loginRouter');
const cors = require('cors');
const app = express();

app.set('port', process.env.PORT || 3005);
app.use(express.json());
app.use(cors());

app.use('/api', cadastroRouter);
app.use('/api', postRouter);
app.use('/api', loginRouter);

module.exports = app;