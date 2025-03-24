import express from 'express';
import * as authController from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/check-fraud', authMiddleware, authController.checkFraud);
router.get('/user', authMiddleware, authController.getUser); // New route

export default router;