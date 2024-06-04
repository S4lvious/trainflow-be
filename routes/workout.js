const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const authenticateJWT = require('../middleware/authMiddleware');

// Rotte per le API
router.get('/getExerciseByDateAndUserId/:userId/:date', authenticateJWT, workoutController.getExerciseByDateAndUserId);
router.get('/getAllExercises', authenticateJWT, workoutController.getAllExercises);
router.post('/addExercise', authenticateJWT, workoutController.addExercise);
router.get('/viewReport/:userId', authenticateJWT, workoutController.viewReport);

module.exports = router;