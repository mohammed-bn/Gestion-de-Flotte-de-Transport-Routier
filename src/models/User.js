const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName:  { type: String, required: true, trim: true },
  phone:     { type: String, required: true, unique: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: true, minlength: 6, select: false },
  CIN:       { type: String, required: true, unique: true },
  dateOfBirth: { type: Date, required: true },

  
  drivingLicenseNumber: { type: String, required: true, unique: true },
  categoryPermis: {
    type: String,
    enum: ['A', 'B', 'C', 'D', 'E', 'C1', 'D1', 'CE', 'DE'],
    required: true
  },
  issueDatePermis:  { type: Date, required: true },
  expiryDatePermis: { type: Date, required: true },


  statusUser: {
    type: String,
    enum: ['actif', 'suspendu', 'inactif'],
    default: 'actif'
  },

 
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },

  
  refreshToken: { type: String, select: false }
}, { timestamps: true });



userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);
});


userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);