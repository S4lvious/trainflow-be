const express = require('express');
const mysql = require('mysql');
require('dotenv').config(); 

const app = express();

// Configurazione della connessione al database MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectionLimit: process.env.DB_CONNECTION_LIMIT
});

function executeQuery(query, params, callback) {
  pool.getConnection((err, connection) => {
    if (err) {
      callback(err, null);
      return;
    }
    connection(query, params, (error, results) => {
      connection.release();

      if (error) {
        callback(error, null);
        return;
      }
      callback(null, results);
    });
  });
}






module.exports = executeQuery;