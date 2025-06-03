const router = require('express').Router();
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
    try {
        // Check if user already exists
        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        // Create new user with plain text password
        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password // Store password as plain text as requested
        });

        // Save user to database
        await user.save();

        // Return user info (excluding password)
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email
        };
        
        res.status(201).json({ 
            message: 'User registered successfully',
            user: userData
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        // Check if user exists
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).json({ message: 'Email or password is incorrect' });

        // Check password (plain text comparison)
        const validPassword = (req.body.password === user.password);
        if (!validPassword) return res.status(400).json({ message: 'Email or password is incorrect' });

        // Return user info
        res.status(200).json({ 
            message: 'Login successful',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 