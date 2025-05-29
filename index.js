import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URL);
    isConnected = true;
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ DB error:', error.message);
  }
};

// Connect DB for every request (you can optimize this if you want)
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// **Add this route to show backend running on root URL**
app.get('/', (req, res) => {
  res.send('<h1>Fashiony Backend Running...</h1>');
});

// Mount your API routes (like /register, /login, etc.)
app.use('/api', userRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

export default app;
