import { Router } from 'express';
import { register, login } from '../controllers/authController.js';
import { body } from 'express-validator';
const router = Router();

router.post('/register', [
    // Validate and sanitize username
    body('username')
      .isEmail()
      .withMessage('Username must be an email address')
      .trim()
      .escape(),
    // Validate password
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
    //   .matches(/\d/)
    //   .withMessage('Password must contain a number')
    //   .matches(/[A-Z]/)
    //   .withMessage('Password must contain an uppercase letter'),
  ], register);
router.post('/login', login);

export default router;
