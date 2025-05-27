import express from 'express';
import serverless from 'serverless-http';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRoutes from '../routes/userRoutes.js'; 

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

connectDB();

app.use('/api', userRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export const handler = serverless(app);
