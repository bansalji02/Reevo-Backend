import express, { json } from 'express';
import { connect } from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import accountRoutes from './routes/accountRoutes.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(json());
app.use('/api/auth', authRoutes);
app.use('/api', accountRoutes);
console.log(process.env.MONGO_URI);

connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

export default app;
