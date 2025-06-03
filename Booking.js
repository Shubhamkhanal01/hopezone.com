const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Optional, as non-registered users can also book
    },
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    phoneNumber: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 15
    },
    game: {
        type: String,
        required: true
    },
    hours: {
        type: Number,
        required: true,
        min: 1
    },
    totalCost: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    playDate: {
        type: Date,
        required: true
    }
});

// Check if model exists before creating it
module.exports = mongoose.models.Booking || mongoose.model('Booking', bookingSchema); 