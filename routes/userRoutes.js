// routes/userRoutes.js
import express from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import User from '../Model/userModel.js';
import Products from '../Model/proModel.js';

const router = express.Router();

// Test route
router.get('/', (req, res) => {
  res.send('Fashiony Backend Running.....');
});

// Register
router.post('api/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { fullname, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ fullname, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    res.json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Product
router.get('/product', async (req, res) => {
  try {
    const filter = req.query.statusFilter ? { status: req.query.statusFilter } : {};
    const products = await Products.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

export default router;
