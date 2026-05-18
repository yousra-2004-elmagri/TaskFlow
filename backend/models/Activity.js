const mongoose = require('mongoose');
const activitySchema = new mongoose.Schema({
      Action: { 
        type: String,
        required: true},
    projet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    utilisateur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Activity', activitySchema);