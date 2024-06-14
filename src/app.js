const express = require('express');
const dotenv = require('dotenv').config();
const taskRouter = require('./routes/taskRouter');
<<<<<<< HEAD
const postRouter = require('./routes/postRouter');
=======
>>>>>>> fd3e9e72dcd8aa70484fb34c9b1e1e07f52ecdba
const cors = require('cors');
const app = express();

app.set('port', process.env.PORT || 3005);
app.use(express.json());
app.use(cors());
<<<<<<< HEAD

app.use('/api', taskRouter);
app.use('/api', postRouter);
=======
app.use('/api', taskRouter);
>>>>>>> fd3e9e72dcd8aa70484fb34c9b1e1e07f52ecdba

module.exports = app;