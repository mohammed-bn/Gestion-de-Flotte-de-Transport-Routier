const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, default: '' },

  departureLocation: { type: String, required: true },
  destination:       { type: String, required: true },

  startDateTime: { type: Date, required: true },
  endDateTime:   { type: Date, required: true },

  status: {
    type: String,
    enum: ['a_faire', 'en_cours', 'termine', 'annule'],
    default: 'a_faire'
  },

  // Relations
  trajet:  { type: mongoose.Schema.Types.ObjectId, ref: 'Trajet' },
  chauffeur: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  camion:    { type: mongoose.Schema.Types.ObjectId, ref: 'TracteurRoutier' },
  remorque:  { type: mongoose.Schema.Types.ObjectId, ref: 'SemiRemorque' }
}, { timestamps: true });

module.exports = mongoose.model('Mission', missionSchema);