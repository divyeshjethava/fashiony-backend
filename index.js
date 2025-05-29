import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';  // <-- import cors here
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());

// Enable CORS for frontend domain
app.use(cors({
  origin: 'https://fashiony-frontend.vercel.app/', // replace with your React app URL if different
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

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

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.get('/', (req, res) => {
  res.send('<h1>Fashiony Backend Running...</h1>');
});

app.use('/api', userRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

export default app;
