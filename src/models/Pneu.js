const mongoose = require('mongoose');

const pneuSchema = new mongoose.Schema({
  reference: { type: String, required: true, unique: true },
  brand:     { type: String, required: true },
  dimension: { type: String, required: true }, 

  position: {
    type: String,
    enum: ['avant_gauche', 'avant_droit', 'arriere_gauche', 'arriere_droit',
           'secours', 'essieu1_gauche', 'essieu1_droit',
           'essieu2_gauche', 'essieu2_droit'],
    required: true
  },

  installationDate: { type: Date, required: true },
  expiryDate:       { type: Date },


  kmInstallation: { type: Number, required: true, default: 0 },
  kmUsure:        { type: Number, default: 0 }, 
  seuilKm:        { type: Number, required: true, default: 80000 }, 

  
  needsReplacement: { type: Boolean, default: false },


  vehiculeId:   { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'vehiculeType' },
  vehiculeType: { type: String, required: true, enum: ['TracteurRoutier', 'SemiRemorque'] }
}, { timestamps: true });


pneuSchema.methods.checkUsure = function () {
  this.needsReplacement = this.kmUsure >= this.seuilKm;
  return this.needsReplacement;
};

module.exports = mongoose.model('Pneu', pneuSchema);