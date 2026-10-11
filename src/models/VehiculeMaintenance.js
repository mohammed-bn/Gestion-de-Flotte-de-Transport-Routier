const mongoose = require('mongoose');

// Table de liaison : historique véhicule ↔ maintenance
const vehiculeMaintenanceSchema = new mongoose.Schema({
  // Polymorphique
  vehiculeId:   { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'vehiculeType' },
  vehiculeType: { type: String, required: true, enum: ['TracteurRoutier', 'SemiRemorque'] },

  maintenanceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Maintenance' },
  problemeId:    { type: mongoose.Schema.Types.ObjectId, ref: 'ProblemeMaintenance' },

  dateDebut: { type: Date, required: true },
  dateFin:   { type: Date },

  kilometrageAuMoment: { type: Number, required: true },

  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('VehiculeMaintenance', vehiculeMaintenanceSchema);