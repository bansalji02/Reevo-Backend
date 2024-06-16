import Account from '../models/account.js';


export async function createAccount(req, res) {
  try {

      // Function to generate a random 10-digit number
      const generateAccountNumber = async () => {
        let isUnique = false;
        let accountNumber;
        
        while (!isUnique) {
          accountNumber = Math.floor(Math.random() * 9000000000) + 1000000000; // Generate a 10-digit number
          const existingAccount = await Account.findOne({ accountNumber });
          if (!existingAccount) {
            isUnique = true;
          }
        }
        
        return accountNumber;
      };
  
      // Generate unique account number
      const accountNumber = await generateAccountNumber();

    

    const account = new Account({ ...req.body,accountNumber,  userId: req.user.userId });
    await account.save();
    res.status(201).send(`Account created with account number ${account.accountNumber}`);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

export async function getBalance(req, res) {
  try {
    const account = await Account.findById(req.params.id);
    if (!account || account.userId.toString() !== req.user.userId) {
      return res.status(404).send('Account not found');
    }
    res.send({ balance: account.balance });
  } catch (error) {
    res.status(400).send(error.message);
  }
}

export async function deposit(req, res) {
  try {
    const account = await Account.findById(req.params.id);
    if (!account || account.userId.toString() !== req.user.userId) {
      return res.status(404).send('Account not found');
    }
    if (!account.allowCredit) {
      return res.status(403).send('Credits not allowed for this account');
    }
    account.balance += req.body.amount;
    await account.save();
    res.send('Deposit successful');
  } catch (error) {
    res.status(400).send(error.message);
  }
}

export async function withdraw(req, res) {
  try {
    const account = await Account.findById(req.params.id);
    if (!account || account.userId.toString() !== req.user.userId) {
      return res.status(404).send('Account not found');
    }
    if (!account.allowDebit) {
      return res.status(403).send('Debits not allowed for this account');
    }
    if (req.body.amount > account.dailyWithdrawalLimit) {
      return res.status(403).send('Withdrawal amount exceeds daily limit');
    }
    if (req.body.amount > account.balance) {
      return res.status(400).send('Insufficient funds');
    }
    account.balance -= req.body.amount;
    await account.save();
    res.send('Withdrawal successful');
  } catch (error) {
    res.status(400).send(error.message);
  }
}
