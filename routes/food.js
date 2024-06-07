const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');
const authenticateJWT = require('../middleware/authMiddleware');
const checkFatSecretExpirationToken = require('../middleware/fatSecretMiddleware');

router.get('/searchFood/:foodName/:userId', authenticateJWT, checkFatSecretExpirationToken, foodController.searchFood);
router.get('/getFoodById/:foodId/:userId', authenticateJWT, checkFatSecretExpirationToken, foodController.getFoodById);
router.get('/getFoodsByUser/:userId/:date', authenticateJWT, checkFatSecretExpirationToken, foodController.getFoodByUser);
router.post('/addFoodToUser', authenticateJWT, checkFatSecretExpirationToken, foodController.addFood);
router.delete('/deleteFoodFromUser/:id', authenticateJWT, checkFatSecretExpirationToken, foodController.deleteFood);

module.exports = router;