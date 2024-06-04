const crypto = require('crypto');
const connection = require('../db'); // Importa la connessione al database da db.js
const jwt = require('jsonwebtoken');
const {
  OAuth2Client
} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.login = async (req, res) => {

  const {
    idToken
  } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    try {
      console.log('arrivo qui');
      const query = 'SELECT * FROM users WHERE email = ?';
      console.log('arrivo qui 2');
      connection.query(query, [payload.email], (err, result) => {
        console.log('arrivo qui 3');
        if (err) {
          res.status(500).json({
            error: 'Errore durante il login'
          });
          return;
        }
        if (result.length === 0) {
          console.log('Utente non trovato, lo inserisco nel database');
          const query = 'INSERT INTO users (username, isAdmin, email, profile_pic) VALUES (?, ?, ?, ?)';
          connection.query(query, [payload.name, 0, payload.email, payload.picture], (err, result) => {
            if (err) {
              res.status(500).json({
                error: 'Errore durante la registrazione'
              });
              console.log(err);
              return
            }
            console.log('Utente inserito, genero il token', result.insertId);
            const user = {
              id: result.insertId,
              username: payload.name,
              isAdmin: 0,
              email: payload.email,
              profile_pic: payload.picture
            };
            const token = jwt.sign(user, process.env.JWT_SECRET, {
              expiresIn: '1h'
            });
            res.status(200).json({
              token,
              userWithOutPassword: user
            });

          });
        } else {
          const user = JSON.parse(JSON.stringify(result[0]));
          console.log('Utente trovato, genero il token', user);
          
          const token = jwt.sign(user, process.env.JWT_SECRET, {
            expiresIn: '1h'
          });
          res.status(200).json({
            token,
            userWithOutPassword: user
          });
        }
      });

    } catch (error) {
      res.status(500).json({
        error: 'Errore durante il login'
      });
      return;
    }
  } catch (error) {
    res.status(401).json({
      error: 'Token non valido'
    });
    return;

  }

};