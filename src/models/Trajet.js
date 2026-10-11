const mongoose = require('mongoose');

const trajetSchema = new mongoose.Schema({
  departureLocation: { type: String, required: true },
  arrivalLocation:   { type: String, required: true },

  departureDateTime: { type: Date, required: true },
  arrivalDateTime:   { type: Date },


  kmDepart:  { type: Number, required: true, min: 0 },
  kmArrivee: { type: Number, min: 0 },
  kmTotal:   { type: Number, default: 0 },


  volumeGasoil: { type: Number, default: 0 }, // litres
  coutGasoil:   { type: Number, default: 0 }, // MAD
  consommationMoyenne: { type: Number, default: 0 }, // L/100km


  remarques: { type: String, default: '' },


  status: {type: String, enum: ['a_faire', 'en_cours', 'termine'],default: 'a_faire'},

  
  chauffeur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  camion:    { type: mongoose.Schema.Types.ObjectId, ref: 'TracteurRoutier', required: true },
  remorque:  { type: mongoose.Schema.Types.ObjectId, ref: 'SemiRemorque', required: true },
  mission:   { type: mongoose.Schema.Types.ObjectId, ref: 'Mission' },

  pdfUrl: { type: String, default: null }
}, { timestamps: true });


trajetSchema.methods.calculerKmTotal = function () {
  if (this.kmArrivee > this.kmDepart) {
    this.kmTotal = this.kmArrivee - this.kmDepart;
  }
  return this.kmTotal;
};

trajetSchema.methods.calculerConsommation = function () {
  if (this.kmTotal > 0 && this.volumeGasoil > 0) {
    this.consommationMoyenne = (this.volumeGasoil / this.kmTotal) * 100;
  }
  return this.consommationMoyenne;
};

module.exports = mongoose.model('Trajet', trajetSchema);