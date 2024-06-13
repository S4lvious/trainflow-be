const crypto = require('crypto');
const connection = require('../db'); // Importa la connessione al database da db.js
const jwt = require('jsonwebtoken');
const axios = require('axios');
const {
  OAuth2Client
} = require('google-auth-library');
const e = require('express');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


exports.searchFood = async (req, res) => {
    const { foodName, userId } = req.params;
    try {
        const query = 'SELECT * FROM fat_secret_user_token WHERE user_id = ?';
        connection(query, [userId], (err, result) => {
            if (err || result.length === 0) {
                res.status(500).json({
                    error: 'Errore durante il recupero del token'
                });
                return;
            }  else {
                const token = result[0].token;
                axios.get('https://platform.fatsecret.com/rest/server.api', {
                    headers: {
                      'Authorization': 'Bearer ' + token,
                    },
                    params: {
                      'method': 'foods.search',
                      'search_expression': foodName,
                      'format': 'json',
                    }
                  }).then(response => {
                    res.status(200).json(response.data);
                  }).catch(error => {
                    console.error(error);
                    res.status(500).json({
                      error: error
                    });
                    return;
                  });
            }
        });
    }
    catch (error) {
        res.status(500).json({
            error: error
        });
        return;
    }
}

exports.getFoodById = async (req, res) => {
    const { foodId, userId } = req.params;
    try {
        const query = 'SELECT * FROM fat_secret_user_token WHERE user_id = ?';
        connection(query, [userId], (err, result) => {
            if (err || result.length === 0) {
                res.status(500).json({
                    error: 'Errore durante il recupero del token'
                });
                return;
            }  else {
                const token = result[0].token;
                axios.get('https://platform.fatsecret.com/rest/server.api', {
                    headers: {
                      'Authorization': 'Bearer ' + token,
                    },
                    params: {
                      'method': 'food.get.v4',
                      'food_id': foodId,
                      'format': 'json',
                    }
                  }).then(response => {
                    res.status(200).json(response.data);
                  }).catch(error => {
                    console.error(error);
                    res.status(500).json({
                      error: error
                    });
                    return;
                  });
            }
        });
    } catch (error) {
        res.status(500).json({
            error: error
        });
        return;
    }
}

exports.getFoodByUser = async (req, res) => {
    const { userId, date } = req.params;
    try {
        const query = 'SELECT * FROM current_food WHERE user_id = ? AND date = ?';
        connection(query, [userId, date], (err, result) => {
            if (err) {
                res.status(500).json({
                    error: 'Errore durante il recupero del cibo'
                });
                return;
            } else {
                res.status(200).json(result);
            }
        });
    } catch (error) {
        res.status(500).json({
            error: error
        });
        return;
    }


}

exports.addFood = async (req, res) => {
    const { userId, food, date } = req.body;

    try {
        const query = 'INSERT INTO current_food (food_id,food_name,user_id, grams, food_qty,food_calories,food_proteins, food_carbs,food_fats, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        connection(query, [food.foodId,food.name, userId, food.grams,food.quantity,food.calories,food.proteins,food.carbs,food.fats,date], (err, result) => {
            if (err) {
                res.status(500).json({
                    error: 'Errore durante l\'inserimento del cibo'
                });
                return;
            } else {
                res.status(200).json({
                    message: 'Cibo inserito correttamente'
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            error: error
        });
        return;
    }
}

exports.deleteFood = async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'DELETE FROM current_food WHERE id_current = ?';
        connection(query, [id], (err, result) => {
            if (err) {
                res.status(500).json({
                    error: err
                });
                return;
            } else {
                res.status(200).json({
                    message: 'Cibo cancellato correttamente'
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            error: error
        });
        return;
    }
}

// foodId: number; -> food_id
// name: string; .> food_name
// grams: boolean; -> grams
// quantity: number; -> food_qty
// calories: number; -> food_calories
// proteins: number; -> food_proteins
// carbs: number; -> food_carbs
// fats: number; -> food_fats
// date: string; -> date
// userId: number; -> user_id
