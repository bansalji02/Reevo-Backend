import { Schema, model } from 'mongoose';
import { hash } from 'bcrypt';



//This is the schema to define the user model
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await hash(this.password, 10);
  }
  next();
});

const User = model('User', userSchema);
export default User;
