import User from '../models/user.js';
import  jwt from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { validationResult } from 'express-validator';



export async function register(req, res) {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  

    const { username, password, firstName,lastName } = req.body; 
    // Checking if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ errors: [{ msg: 'Username already exists' }] });
    }

    const user = new User({ username, password,firstName,lastName  });
    //creating a user and saving it in mongodb
    await user.save();
    res.status(201).send('User registered');
  } catch (error) {
    res.status(400).send(error.message);
  }
}

export async function login(req, res) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    
    if (!user || !(await compare(password, user.password))) {
      return res.status(401).send('Invalid credentials');
    }
    const token = jwt.sign({ userId: user._id, firstName: user.firstName,lastName: user.lastName }, process.env.JWT_SECRET);
    res.send({ token });
  } catch (error) {
    res.status(400).send(error.message);
  }
}
