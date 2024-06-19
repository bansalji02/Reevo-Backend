import { Schema, model } from 'mongoose';

//schema to define the account model

const accountSchema = new Schema({


  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  accountNumber: { type: String, required: true, unique: true },
  sortCode: { type: String, required: true },
  activeStatusFlag: { type: Boolean, default: true },
  allowCredit: { type: Boolean, default: true },
  allowDebit: { type: Boolean, default: true },
  balance: { type: Number, default: 0 },
  dailyWithdrawalLimit: { type: Number, default: 1000 }
});

const Account = model('Account', accountSchema);
export default Account;
