const router = require('express').Router();
const User = require('../models/User');
const auth = require('../middlewares/auth');

// Get user data
router.get('/:id', auth, async (req, res) => {
    try {
        // Check if user is requesting their own data
        if (req.params.id !== req.user._id) {
            return res.status(403).json({ message: 'Access denied' });
        }
        
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user profile
router.put('/:id', auth, async (req, res) => {
    try {
        // Check if user is updating their own data
        if (req.params.id !== req.user._id) {
            return res.status(403).json({ message: 'Access denied' });
        }
        
        // Update only allowed fields
        const updateData = {};
        if (req.body.name) updateData.name = req.body.name;
        if (req.body.profileImage) updateData.profileImage = req.body.profileImage;
        
        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).select('-password');
        
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 