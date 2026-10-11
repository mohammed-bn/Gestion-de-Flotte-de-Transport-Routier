const mongoose = require('mongoose');

const carburantSchema = new mongoose.Schema({
  volume:   { type: Number, required: true, min: 0 }, 
  cout:     { type: Number, required: true, min: 0 },
  prixLitre: { type: Number, required: true, min: 0 },

  datePlein: { type: Date, required: true, default: Date.now },
  station:   { type: String, default: '' },

  kilometrageAuPlein: { type: Number, required: true },

  
  camion: { type: mongoose.Schema.Types.ObjectId, ref: 'TracteurRoutier', required: true },
  trajet: { type: mongoose.Schema.Types.ObjectId, ref: 'Trajet' },
  chauffeur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Carburant', carburantSchema);