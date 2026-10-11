const mongoose = require('mongoose');

const semiRemorqueSchema = new mongoose.Schema({
  registrationNumber: { type: String, required: true, unique: true, uppercase: true },
  brand: { type: String, required: true },
  model: { type: String, required: true }, 

  type: {
    type: String,
    enum: ['frigorifique', 'plateau', 'citerne', 'benne', 'porte_conteneur', 'savoyarde'],
    required: true
  },

  maxLoad:     { type: Number, required: true, min: 0 }, 
  emptyWeight: { type: Number, required: true, min: 0 },
  capacity:    { type: Number, required: true, min: 0 }, 

  status: {
    type: String,
    enum: ['disponible', 'en_mission', 'maintenance', 'archive'],
    default: 'disponible'
  },

  maintenanceAlert: { type: Boolean, default: false },

  // Relations
  pneus: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pneu' }],

  isArchived: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('SemiRemorque', semiRemorqueSchema);