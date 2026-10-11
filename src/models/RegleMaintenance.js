const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  startDate: { type: Date, required: true },
  endDate:   { type: Date },

  description: { type: String, required: true },
  garage:      { type: String, default: '' },

  status: {
    type: String,
    enum: ['planifiee', 'en_cours', 'terminee', 'annulee'],
    default: 'planifiee'
  },

  partsUsed: { type: String, default: '' },
  notes:     { type: String, default: '' },
  cout:      { type: Number, default: 0 },

  // Relations
  problemeId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProblemeMaintenance', required: true },

  // Polymorphique
  vehiculeId:   { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'vehiculeType' },
  vehiculeType: { type: String, required: true, enum: ['TracteurRoutier', 'SemiRemorque'] }
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', maintenanceSchema);