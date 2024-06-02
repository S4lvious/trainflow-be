const crypto = require('crypto');
const connection = require('../db'); // Importa la connessione al database da db.js
const jwt = require('jsonwebtoken');
const env = require('dotenv').config();


exports.login = async (req, res)  => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  
    connection.query(query, [username, password], (error, results, fields) => {
      if (error) {
        console.error('Errore durante il login:', error);
        res.status(500).json({ error: 'Errore durante il login' });
        return;
      }
      if (results.length > 0) {
        const user = results[0];
        const userWithoutPassword = { ...user, password: null };
        const token = jwt.sign(userWithoutPassword, process.env.JWT_SECRET);

        res.status(200).json({ message: 'Login riuscito' });
      } else {
        // Credenziali non valide
        res.status(401).json({ error: 'Credenziali non valide' });
      }
    });
  
};