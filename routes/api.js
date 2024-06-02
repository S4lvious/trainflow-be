const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

// Rotte per le API
router.get('/data', apiController.getData);
router.post('/data', apiController.createData);

module.exports = router;