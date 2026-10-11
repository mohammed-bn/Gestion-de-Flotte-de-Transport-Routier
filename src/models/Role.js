const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['admin', 'chauffeur'],
    required: true,
    unique: true
  },
  description: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);