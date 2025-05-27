import express from 'express';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import User from '../Model/userModel.js';
import Products from '../Model/proModel.js';
const router = express.Router();


router.post('/register', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ fullname, email, password: hashedPassword });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
});


router.post('/login', async (req, res) => {

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email address' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password, try again' });
        }

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
});

  
 



  
router.get('/product',async (req , res) => {
    try {
        const { statusFilter = '' } = req.query;  
        const filter = statusFilter ? { status: statusFilter } : {};  
    
        
        const products = await Products.find(filter);
        
      
          
          res.json(products );
        
      } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error });
      }
});

export default router;
