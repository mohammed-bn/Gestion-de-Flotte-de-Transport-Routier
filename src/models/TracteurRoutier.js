const mongoose = require('mongoose');

const tracteurSchema = new mongoose.Schema({
  registrationNumber: { type: String, required: true, unique: true, uppercase: true },
  brand:  { type: String, required: true },
  model:  { type: String, required: true }, 

  vehicleType: {
    type: String,
    enum: ['camion', 'tracteur', 'utilitaire', 'benne', 'citerne'],
    required: true
  },
  fuelType: {
    type: String,
    enum: ['diesel', 'essence', 'electrique', 'hybride'],
    required: true
  },

  mileage: { type: Number, default: 0, min: 0 },

  registrationDate:           { type: Date },
  technicalInspectionDate:    { type: Date },
  technicalInspectionExpiry:  { type: Date },
  insuranceNumber:            { type: String },
  insuranceExpiryDate:        { type: Date },

  status: {
    type: String,
    enum: ['disponible', 'en_mission', 'maintenance', 'archive'],
    default: 'disponible'
  },


  maintenanceAlert: { type: Boolean, default: false },
  lastVidangeKm:    { type: Number, default: 0 },
  lastRevisionKm:   { type: Number, default: 0 },


  pneus: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pneu' }],


  isArchived: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('TracteurRoutier', tracteurSchema);