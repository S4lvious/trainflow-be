const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateJWT = require('../middleware/authMiddleware');

router.get('/userList', authenticateJWT, userController.userList);
router.get('/:id', authenticateJWT, userController.getUserById);
router.get('/getGameParametersById/:id_utente/:tipo', authenticateJWT, userController.getGameParametersById);
router.get('/getGlobalGameParameters/:id_utente/', authenticateJWT, userController.getGlobalGameParametersById);
router.get('/getBonusByUserId/:id_utente/', authenticateJWT, userController.getBonusByUserId);
router.get('/getUserDisabledGames/:id_utente/', authenticateJWT, userController.getUserDisabledGames);


module.exports = router;
