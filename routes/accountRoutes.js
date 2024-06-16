import { Router } from 'express';
import { createAccount, getBalance, deposit, withdraw } from '../controllers/accountController.js';
import auth from '../middleware/authMiddleware.js';
const router = Router();

router.post('/accounts', auth, createAccount);
router.get('/accounts/:id/balance', auth, getBalance);
router.post('/accounts/:id/deposit', auth, deposit);
router.post('/accounts/:id/withdraw', auth, withdraw);

export default router;
