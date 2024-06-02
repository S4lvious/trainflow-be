const express = require('express');
const mysql = require('mysql');
require('dotenv').config(); 

const app = express();

// Configurazione della connessione al database MySQL
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

// Connessione al database MySQL
connection.connect((err) => {
  if (err) {
    console.error('Errore di connessione al database:', err);
    return;
  }
  console.log('Connessione al database MySQL riuscita!');
});