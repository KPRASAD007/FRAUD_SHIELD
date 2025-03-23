const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/user', authMiddleware, userController.getUser);
router.post('/check-fraud', authMiddleware, userController.checkFraud);

module.exports = router;