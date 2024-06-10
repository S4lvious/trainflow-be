const crypto = require('crypto');
const connection = require('../db'); // Importa la connessione al database da db.js
const jwt = require('jsonwebtoken');
const {
  OAuth2Client
} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const axios = require('axios');
const qs = require('qs');


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
            const clientId = process.env.FAT_SECRET_CLIENT_ID;
            const clientSecret = process.env.FAT_SECRET_CLIENT_SECRET;
            requestAccessToken(clientId, clientSecret)
              .then(tokenFatSecret => {
                const query = 'INSERT INTO fat_secret_user_token (user_id,token,expires_in) VALUES (?, ?, ?)';
                connection.query(query, [user.id, tokenFatSecret.access_token, tokenFatSecret.expires_in], (err, result) => {
                  if (err) {
                    res.status(500).json({
                      error: 'Errore durante la registrazione'
                    });
                    return;
                  } else {
                    const token = jwt.sign(user, process.env.JWT_SECRET, {
                      expiresIn: '1h'
                    });
                    res.status(200).json({
                      token,
                      userWithOutPassword: user
                    });
                  }
                });
              })
              .catch(error => {
                res.status(500).json({
                  error: 'Errore durante la registrazione'
                });
                return;
              });
          });
        } else {
          const user = JSON.parse(JSON.stringify(result[0]));
          const query = 'SELECT * FROM fat_secret_user_token WHERE user_id = ?';
          connection.query(query, [user.id], (err, result) => {
            if (err) {
              res.status(500).json({
                error: 'Errore durante il login'
              });
              return;
            } else {
              if (result.length > 0) {
              const createdAt = result[0].created_at.toString();
              }
              if (result.length === 0 || (createdAt && isTokenExpired(createdAt))) {
                console.log('Token scaduto, lo rinnovo');
                const clientId = process.env.FAT_SECRET_CLIENT_ID;
                const clientSecret = process.env.FAT_SECRET_CLIENT_SECRET;
                requestAccessToken(clientId, clientSecret)
                  .then(tokenFatSecret => {
                    console.log('Token rinnovato, lo inserisco nel database', tokenFatSecret);
                    const query = 'INSERT INTO fat_secret_user_token (user_id,token,expires_in) VALUES (?, ?, ?)';
                    connection.query(query, [user.id, tokenFatSecret.access_token, tokenFatSecret.expires_in], (err, result) => {
                      if (err) {
                        console.log(err);
                        res.status(500).json({
                          error: 'Errore durante la registrazione'
                        });
                        return;
                      } else {
                        const token = jwt.sign(user, process.env.JWT_SECRET, {
                          expiresIn: '1h'
                        });    
                        res.status(200).json({
                          token,
                          userWithOutPassword: user
                        });
                      }
                    });
                  })
                  .catch(error => {
                    res.status(500).json({
                      error: error
                    });
                    return;
                  });
              } else {
                res.status(200).json({
                  token,
                  userWithOutPassword: user
                });
              }
            }
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

function isTokenExpired(createdAt) {
    // Converti il timestamp in un oggetto Date
    const createdAtDate = new Date(createdAt);
    if (isNaN(createdAtDate.getTime())) {
        throw new TypeError('Il timestamp fornito non è valido');
    }

    const createdAtTimestamp = createdAtDate.getTime();
    const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000;
    const currentTimestamp = Date.now(); // Ottieni l'attuale timestamp in millisecondi
    return currentTimestamp > (createdAtTimestamp + twentyFourHoursInMilliseconds);
}



async function requestAccessToken(clientId, clientSecret) {
  try {
    // Costruisci i dati della richiesta di token
    const data = qs.stringify({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      scope: ['basic', 'premier']
    });

    // Effettua la richiesta POST per ottenere il token di accesso
    const response = await axios.post('https://oauth.fatsecret.com/connect/token', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    // Restituisci il token di accesso dalla risposta
    return response.data;
  } catch (error) {
    // Gestisci eventuali errori nella richiesta del token di accesso
    throw new Error(`Errore nella richiesta del token di accesso: ${error.response.data.error_description}`);
  }
}
