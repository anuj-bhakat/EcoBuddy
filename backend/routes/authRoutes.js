import express from 'express';
import { signupUser, loginUser, signupAdmin, loginAdmin, loginCreator, forgotPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();

// User routes
router.post('/signup/user', signupUser);
router.post('/login/user', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Creator login route
router.post('/login/creator', loginCreator);

// Admin routes
router.post('/signup/admin', signupAdmin);
router.post('/login/admin', loginAdmin);

export default router;
