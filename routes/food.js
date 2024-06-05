const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');
const authenticateJWT = require('../middleware/authMiddleware');

router.get('/searchFood/:foodName/:userId', authenticateJWT, foodController.searchFood);
router.get('/getFoodById/:foodId/:userId', authenticateJWT, foodController.getFoodById);
router.get('/getFoodsByUser/:userId/:date', authenticateJWT, foodController.getFoodByUser);
router.post('/addFoodToUser', authenticateJWT, foodController.addFood);
router.delete('/deleteFoodFromUser/:id', authenticateJWT, foodController.deleteFood);

module.exports = router;