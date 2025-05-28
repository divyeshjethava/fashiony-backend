import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import serverless from 'serverless-http';
import userRoutes from './routes/userRoutes.js';  // Adjust path if needed

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// DB Connection (optional, remove if not using DB)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ DB error:', error.message);
  }
};
connectDB();

// Routes
app.use('/', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Error handling
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

// ✅ MUST use "default" export for Vercel
export default serverless(app);