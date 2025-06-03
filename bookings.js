const router = require('express').Router();
const Booking = require('../models/Booking');
const auth = require('../middlewares/auth');

// Create a new booking
router.post('/', async (req, res) => {
    try {
        // Calculate total cost
        const hourlyRate = 200;
        const hours = req.body.hours;
        const totalCost = hours * hourlyRate;
        
        // Create new booking
        const booking = new Booking({
            userId: req.body.userId || null,
            name: req.body.name,
            phoneNumber: req.body.phoneNumber,
            game: req.body.game,
            hours: hours,
            totalCost: totalCost,
            playDate: req.body.playDate || new Date()
        });
        
        await booking.save();
        
        res.status(201).json(booking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all bookings - protected route, requires authentication
router.get('/', auth, async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get bookings for a specific user
router.get('/user/:userId', auth, async (req, res) => {
    try {
        // Ensure user is requesting their own bookings
        if (req.params.userId !== req.user._id) {
            return res.status(403).json({ message: 'Access denied' });
        }
        
        const bookings = await Booking.find({ userId: req.params.userId });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update booking status
router.patch('/:id/status', auth, async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { paymentStatus: req.body.paymentStatus },
            { new: true }
        );
        
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        
        res.json(booking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 