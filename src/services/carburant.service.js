const Carburant = require('../models/Carburant');
const Trajet = require('../models/Trajet');
const ApiError = require('../utils/ApiError');

exports.createCarburant = async (data, user) => {

  if (user.role.role === 'chauffeur') {
    data.chauffeur = user._id;
  }

  data.prixLitre = data.prixLitre || (data.cout / data.volume);

  const carburant = await Carburant.create(data);


  if (data.trajet) {
    await Trajet.findByIdAndUpdate(data.trajet, {
      volumeGasoil: data.volume,
      coutGasoil: data.cout
    });
  }

  return carburant;
};

exports.getAllCarburants = async (filters = {}) => {
  const query = {};
  if (filters.camion) query.camion = filters.camion;
  if (filters.chauffeur) query.chauffeur = filters.chauffeur;
  if (filters.dateDebut || filters.dateFin) {
    query.datePlein = {};
    if (filters.dateDebut) query.datePlein.$gte = new Date(filters.dateDebut);
    if (filters.dateFin) query.datePlein.$lte = new Date(filters.dateFin);
  }

  return Carburant.find(query)
    .populate('camion', 'registrationNumber brand')
    .populate('chauffeur', 'firstName lastName')
    .sort({ datePlein: -1 });
};

exports.getCarburantById = async (id) => {
  const carburant = await Carburant.findById(id)
    .populate('camion')
    .populate('chauffeur', 'firstName lastName');
  if (!carburant) throw new ApiError(404, 'Carburant introuvable');
  return carburant;
};

exports.updateCarburant = async (id, data) => {
  if (data.volume && data.cout) {
    data.prixLitre = data.cout / data.volume;
  }
  const carburant = await Carburant.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  });
  if (!carburant) throw new ApiError(404, 'Carburant introuvable');
  return carburant;
}