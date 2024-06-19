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
    res.status(201).send(`Account created with account number ${account.accountNumber} and document id ${account._id}`);
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

     //now we have account, first we need to check if it is active or not 
    //if it is not active then we should not show the balance
    if (!account.activeStatusFlag) {
      return res.status(403).send('Account is not active');
    }



    res.send({ balance: account.balance });
  } catch (error) {
    res.status(400).send(error.message);
  }
}



export async function transactionType(req, res) {
  try {
    if(!req.params.transactionType || !req.params.id){
      return res.status(400).send('Please provide transaction type and account id');
    }

    const account = await Account.findById(req.params.id);
    const transactionType = req.params.transactionType;


    if (!account || account.userId.toString() !== req.user.userId) {
      return res.status(404).send('Account not found');
    }

     //now we have account, first we need to check if it is active or not 
    //if it is not active then we should not show the balance
    if (!account.activeStatusFlag) {
      return res.status(403).send('Account is not active');
    }

    if(transactionType === 'deposit'){
      if (!account.allowCredit) {
        return res.status(403).send('Credits not allowed for this account');
      }
      account.balance += req.body.amount;
      await account.save();
      res.send('Deposit successful');
      
    }

    if(transactionType === "withdraw"){
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
    }

  } catch (error) {
    res.status(400).send(error.message);
  }
}


export async function changeAccountPermission(req,res){
  try {

    if(!req.params.changeAccountPermission || !req.params.id){
      return res.status(400).send('Please provide PermissionType and account id');

    }

    const account = await Account.findById(req.params.id);
    if (!account || account.userId.toString() !== req.user.userId) {
      return res.status(404).send('Account not found');
    }

     //now we have account, first we need to check if it is active or not 
    //if it is not active then we should not show the balance
    if (!account.activeStatusFlag) {
      return res.status(403).send('Account is not active');
    }

    if(req.params.changeAccountPermission === 'creditPermission'){
      account.allowCredit = !account.allowCredit;
    }
    if(req.params.changeAccountPermission === 'debitPermission'){
      account.allowDebit = !account.allowDebit;
    }
    await account.save();
    res.send('Permission changed');

    
    
  } catch (error) {
    res.status(400).send(error.message);

  }

}

export async function changeAccountStatus(req,res){
  try {
    if(!req.params.id){
      return res.status(400).send('Please provide  account id');
    }
    const account = await Account.findById(req.params.id);
    if (!account || account.userId.toString() !== req.user.userId) {
      return res.status(404).send('Account not found');
    }
    account.activeStatusFlag = !account.activeStatusFlag;
    await account.save();
    res.send(`Your account status is now ${account.activeStatusFlag ? 'active' : 'inactive'}`);

  } catch (error) {
    res.status(400).send(error.message);

  }
}


export async function setWithdrawalLimit(req,res){
  try {
    if(!req.params.id){
      return res.status(400).send('Please provide  account id');
    }
    const account = await Account.findById(req.params.id);
    if (!account || account.userId.toString() !== req.user.userId) {
      return res.status(404).send('Account not found');
    }

     //now we have account, first we need to check if it is active or not 
    //if it is not active then we should not show the balance
    if (!account.activeStatusFlag) {
      return res.status(403).send('Account is not active');
    }

    const newWithdrawalLimit = req.body.dailyWithdrawalLimit;
    console.log(newWithdrawalLimit);
    account.dailyWithdrawalLimit = newWithdrawalLimit;
    await account.save();
    res.send(`Withdraw limit set to ${account.dailyWithdrawalLimit}`);

  } catch (error) {
    res.status(400).send(error.message);

  }
}

export async function getAllAccounts(req,res){
  try {
    if(!req.user.userId){
      return res.status(400).send('Please provide  user id');
    }

    const accounts = await Account.find({userId: req.user.userId});
    res.send(accounts);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

// export async function changeCreditPermission(req,res){
//   try{
//     const account = await Account.findById(req.params.id);
//     if (!account || account.userId.toString() !== req.user.userId) {
//       return res.status(404).send('Account not found');
//     }
//     account.allowCredit = !account.allowCredit;
//     await account.save();
//     res.send('Credit permission changed');
//   } catch (error) {
//     res.status(400).send(error.message);
//   }

// }



// export async function changeDebitPermission(req,res){
//   try{
//     const account = await Account.findById(req.params.id);
//     if (!account || account.userId.toString() !== req.user.userId) {
//       return res.status(404).send('Account not found');
//     }
//     account.allowDebit = !account.allowDebit;
//     await account.save();
//     res.send('Debit permission changed');
//   } catch (error) {
//     res.status(400).send(error.message);
//   }

// }



// export async function deposit(req, res) {
//   try {
//     const account = await Account.findById(req.params.id);
//     if (!account || account.userId.toString() !== req.user.userId) {
//       return res.status(404).send('Account not found');
//     }
//     if (!account.allowCredit) {
//       return res.status(403).send('Credits not allowed for this account');
//     }
//     account.balance += req.body.amount;
//     await account.save();
//     res.send('Deposit successful');
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// }

// export async function withdraw(req, res) {
//   try {
//     const account = await Account.findById(req.params.id);
//     if (!account || account.userId.toString() !== req.user.userId) {
//       return res.status(404).send('Account not found');
//     }
//     if (!account.allowDebit) {
//       return res.status(403).send('Debits not allowed for this account');
//     }
//     if (req.body.amount > account.dailyWithdrawalLimit) {
//       return res.status(403).send('Withdrawal amount exceeds daily limit');
//     }
//     if (req.body.amount > account.balance) {
//       return res.status(400).send('Insufficient funds');
//     }
//     account.balance -= req.body.amount;
//     await account.save();
//     res.send('Withdrawal successful');
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// }
