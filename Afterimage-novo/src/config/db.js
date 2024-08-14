const mysql = require('mysql2');
const dotenv = require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_database,
});

connection.connect(function(err){
    if(err){
        throw err;
    }else{
        console.log('mysql conectado');
    }
});

module.exports = connection;