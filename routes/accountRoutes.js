import { Router } from 'express';
import { createAccount, getBalance,changeAccountPermission, transactionType ,changeAccountStatus,setWithdrawalLimit,getAllAccounts} from '../controllers/accountController.js';
import auth from '../middleware/authMiddleware.js';

const router = Router();

router.post('/createAccount', auth, createAccount);
router.get('/getAllAccounts', auth, getAllAccounts);//fetches all accounts of a user
router.get('/accounts/:id/balance', auth, getBalance);
router.post('/accounts/:id/transaction/:transactionType', auth, transactionType);
router.put('/accounts/:id/permission/:changeAccountPermission', auth, changeAccountPermission);
router.put("/account/:id/changeAccountStatus", auth, changeAccountStatus);
router.put("/account/:id/setWithdrawalLimit", auth, setWithdrawalLimit);



export default router;
