const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection string - use the one from .env
const mongoURI = process.env.MONGODB_URI;

// Connect to MongoDB with more robust error handling
let dbConnected = false;

async function connectToMongoDB() {
    try {
        console.log('Attempting to connect to MongoDB...');
        
        // Use the connection string directly without modifications
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000 // Longer timeout for Atlas
        });
        
        console.log('Connected to MongoDB Atlas successfully');
        dbConnected = true;

        // Only import models after successful connection
        require('./models/User');
        require('./models/Booking');
        
        // Import User model for routes
        const User = mongoose.model('User');
        
        // Set up user routes
        setupUserRoutes(app, User);
        
        // Routes that require database
        const authRoutes = require('./routes/auth');
        const userRoutes = require('./routes/users');
        const bookingRoutes = require('./routes/bookings');
        
        app.use('/api/auth', authRoutes);
        app.use('/api/users', userRoutes);
        app.use('/api/bookings', bookingRoutes);
        
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        console.log('Running in offline mode - database features will not be available');
        console.log('Check your MongoDB Atlas connection string in the .env file');
    }
}

// Setup user routes function
function setupUserRoutes(app, User) {
    // Register new user
    app.post('/api/register', async (req, res) => {
        try {
            if (!dbConnected) {
                return res.status(503).json({ message: 'Database is not connected. Please check MongoDB connection.' });
            }
            
            const { name, email, password } = req.body;
            
            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email is already registered' });
            }
            
            // Create new user - no need to hash password as per requirements
            const newUser = new User({
                name,
                email,
                password // Storing password as plain text (not recommended for production)
            });
            
            await newUser.save();
            
            // Return user data (excluding password)
            const userData = {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                createdAt: newUser.date
            };
            
            res.status(201).json({
                message: 'User registered successfully',
                user: userData
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    });

    // Login user
    app.post('/api/login', async (req, res) => {
        try {
            if (!dbConnected) {
                return res.status(503).json({ message: 'Database is not connected. Please check MongoDB connection.' });
            }
            
            const { email, password } = req.body;
            
            // Find user by email
            const user = await User.findOne({ email });
            
            // Check if user exists and password matches
            if (!user || user.password !== password) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
            
            // Return user data (excluding password)
            const userData = {
                _id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.date
            };
            
            res.json({
                message: 'Login successful',
                user: userData
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    });

    // Get user profile
    app.get('/api/users/:id', async (req, res) => {
        try {
            if (!dbConnected) {
                return res.status(503).json({ message: 'Database is not connected. Please check MongoDB connection.' });
            }
            
            const user = await User.findById(req.params.id).select('-password');
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            res.json(user);
        } catch (error) {
            console.error('Get user error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    });
}

// Try to connect to MongoDB (but continue even if it fails)
connectToMongoDB();

// Home route - always available
app.get('/', (req, res) => {
    const status = dbConnected ? 'Database connected to MongoDB Atlas' : 'Running in offline mode - database features unavailable';
    res.send(`Welcome to Hope Zone API<br>Status: ${status}<br><br>If MongoDB is not connecting, please check your MongoDB Atlas connection string in the .env file.`);
});

// MongoDB status endpoint
app.get('/api/status', (req, res) => {
    res.json({
        server: 'running',
        database: dbConnected ? 'connected to MongoDB Atlas' : 'disconnected',
        message: dbConnected 
            ? 'All systems operational' 
            : 'Database disconnected - please check MongoDB Atlas connection string'
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));