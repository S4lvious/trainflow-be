const env = require('dotenv').config();
const e = require('express');
const connect = require('../db');
const axios = require('axios');
const qs = require('qs');


const checkFatSecretExpirationToken = async (req, res, next) => {
    const userId = req.user.id;
    const query = 'SELECT * FROM fat_secret_user_token WHERE user_id = ?';
    connect.query(query, [userId], (err, result) => {
        if (err || result.length === 0) {
            res.status(500).json({
                error: 'Errore durante il recupero del token'
            });
            return;
        } else {
            const token = result[0].token;
            const createdAt = result[0].created_at.toString();
            console.log(createdAt)
            if (result.length === 0 || isTokenExpired(createdAt)) {
                const clientId = process.env.FAT_SECRET_CLIENT_ID;
                const clientSecret = process.env.FAT_SECRET_CLIENT_SECRET;
                requestAccessToken(clientId, clientSecret)
                    .then(tokenFatSecret => {
                        const query = 'UPDATE fat_secret_user_token SET token = ?, expires_in = ? WHERE user_id = ?';
                        connect.query(query, [tokenFatSecret.access_token, tokenFatSecret.expires_in, userId], (err, result) => {
                            if (err) {
                                res.status(500).json({
                                    error: 'Errore durante la registrazione'
                                });
                                return;
                            }
                            next();
                        });
                    });
            } else {
                console.log('Token valido');
                next();
            }
        }
    });
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
      throw new Error(`Errore nella richiesta del token di accesso: ${error}`);
    }
  }

module.exports = checkFatSecretExpirationToken;


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
