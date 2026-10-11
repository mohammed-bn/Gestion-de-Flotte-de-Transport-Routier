const mongoose = require('mongoose');

const problemeMaintenanceSchema = new mongoose.Schema({
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reportDate: { type: Date, default: Date.now },

  problemType: {
    type: String,
    enum: ['moteur', 'freins', 'pneus', 'transmission', 'electrique',
           'carrosserie', 'climatisation', 'autre'],
    required: true
  },

  description: { type: String, required: true },

  severity: {
    type: String,
    enum: ['faible', 'moyenne', 'haute', 'critique'],
    default: 'moyenne'
  },

  vehicleMileage: { type: Number, required: true },

  // Relations (polymorphique)
  vehiculeId:   { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'vehiculeType' },
  vehiculeType: { type: String, required: true, enum: ['TracteurRoutier', 'SemiRemorque'] },

  status: {
    type: String,
    enum: ['signale', 'en_cours', 'resolu'],
    default: 'signale'
  }
}, { timestamps: true });

module.exports = mongoose.model('ProblemeMaintenance', problemeMaintenanceSchema);