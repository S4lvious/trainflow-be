const crypto = require('crypto');
const connection = require('../db'); // Importa la connessione al database da db.js
const jwt = require('jsonwebtoken');
const {
  OAuth2Client
} = require('google-auth-library');
const { type } = require('os');
const e = require('express');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.getExerciseByDateAndUserId = async (req, res) => {
  const {
    userId,
    date
  } = req.params;
  console.log(userId);
  console.log(date);
    try {
      const query = 'SELECT * FROM current_exercise LEFT JOIN exercises ON current_exercise.exercise_id = exercises.id WHERE user_id = ? AND date = ?';
      connection.query(query, [userId, date], (err, result) => {
        if (err) {
          res.status(500).json({
            error: 'Errore nel recupero degli esercizi'
          });
          return;
        } else {
        const exercises = [];
        result.forEach(exercise => {
            exercises.push({
                id: exercise.id,
                name: exercise.name,
                date: exercise.date,
                userId: exercise.user_id,   
                reps: exercise.exercise_reps,
                sets: exercise.exercise_sets,
                kg: exercise.exercise_kg,
                type: exercise.type,
                difficulty: exercise.difficulty,
            });
        });
        res.status(200).json(exercises);
        }
      });
    } catch (error) {
      res.status(500).json({
        error: error
      });
      return;
    }
};

exports.getAllExercises = async (req, res) => {
  try {
    const query = 'SELECT * FROM exercises';
    connection.query(query, (err, result) => {
      if (err) {
        res.status(500).json({
          error: 'Errore nel recupero degli esercizi'
        });
        return;
      } else {
        const exercises = [];
        result.forEach(exercise => {
          exercises.push({
            id: exercise.id,
            name: exercise.name,
          });
        });
        res.status(200).json(exercises);
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

exports.addExercise = async (req, res) => {
  const {
    userId,
    date,
    id,
    reps,
    sets,
    kg
  } = req.body;
  try {
    const query = 'INSERT INTO current_exercise (user_id, date, exercise_id, exercise_reps, exercise_sets, exercise_kg) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(query, [userId, date, id, reps, sets, kg], (err, result) => {
      if (err) {
        res.status(500).json({
          error: err
        });
        return;
      }
      res.status(200).json({
        message: 'Esercizio inserito correttamente'
      });
    });
  } catch (error) {
    res.status(500).json({
      error: error
    });
    return;
  }
}

exports.viewReport = async (req, res) => {

  const userId = req.params.userId;
  const query = `
      SELECT
          e.name,
          ce.date,
          ce.exercise_kg
      FROM
          current_exercise ce
      JOIN
          exercises e ON ce.exercise_id = e.id
      WHERE
          ce.user_id = ?
      ORDER BY
          ce.date
  `;

  connection.query(query, [userId], (error, results) => {
      if (error) throw error;
      const data = {};
      console.log(results);
      results.forEach(row => {
          const { name, date, exercise_kg } = row;
          if (!data[name]) {
              data[name] = [];
          }
          data[name].push({ date, exercise_kg });
      });
      res.json(data);
  });

}