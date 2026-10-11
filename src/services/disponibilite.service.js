const Trajet = require('../models/Trajet');
const User = require('../models/User');
const TracteurRoutier = require('../models/TracteurRoutier');
const SemiRemorque = require('../models/SemiRemorque');
const ApiError = require('../utils/ApiError');


exports.checkDisponibilite = async ({
  chauffeurId,
  camionId,
  remorqueId,
  departureDateTime,
  arrivalDateTime,
  excludeTrajetId = null
}) => {
  const debut = new Date(departureDateTime);
  const fin = new Date(arrivalDateTime);

  if (debut >= fin)
    throw new ApiError(400, 'La date de départ doit être avant la date d\'arrivée');

  // Filtre chevauchement : (debutA < finB) ET (finA > debutB)
  const overlapFilter = {
    _id: { $ne: excludeTrajetId },
    status: { $in: ['a_faire', 'en_cours'] },
    departureDateTime: { $lt: fin },
    $or: [
      { arrivalDateTime: { $gt: debut } },
      { arrivalDateTime: null }
    ]
  };

  // 1. Vérifier chauffeur
  const chauffeur = await User.findById(chauffeurId).populate('role');
  if (!chauffeur) throw new ApiError(404, 'Chauffeur introuvable');
  if (chauffeur.statusUser === 'suspendu')
    throw new ApiError(403, 'Chauffeur suspendu');
  if (chauffeur.role.role !== 'chauffeur')
    throw new ApiError(400, 'L\'utilisateur n\'est pas un chauffeur');

  const chauffeurConflict = await Trajet.findOne({
    ...overlapFilter,
    chauffeur: chauffeurId
  });
  if (chauffeurConflict)
    throw new ApiError(409, 'Chauffeur déjà occupé sur cette période');

  // 2. Vérifier camion
  const camion = await TracteurRoutier.findById(camionId);
  if (!camion) throw new ApiError(404, 'Camion introuvable');
  if (camion.status === 'maintenance')
    throw new ApiError(409, 'Camion en maintenance');
  if (camion.maintenanceAlert)
    throw new ApiError(409, 'Camion avec alerte de maintenance non traitée');
  if (camion.isArchived)
    throw new ApiError(409, 'Camion archivé');

  const camionConflict = await Trajet.findOne({
    ...overlapFilter,
    camion: camionId
  });
  if (camionConflict)
    throw new ApiError(409, 'Camion déjà occupé sur cette période');

  // 3. Vérifier remorque
  const remorque = await SemiRemorque.findById(remorqueId);
  if (!remorque) throw new ApiError(404, 'Remorque introuvable');
  if (remorque.status === 'maintenance')
    throw new ApiError(409, 'Remorque en maintenance');
  if (remorque.maintenanceAlert)
    throw new ApiError(409, 'Remorque avec alerte de maintenance non traitée');
  if (remorque.isArchived)
    throw new ApiError(409, 'Remorque archivée');

  const remorqueConflict = await Trajet.findOne({
    ...overlapFilter,
    remorque: remorqueId
  });
  if (remorqueConflict)
    throw new ApiError(409, 'Remorque déjà occupée sur cette période');

  return { chauffeur, camion, remorque };
};

/**
 * Vérifie qu'un camion n'est pas sur un autre trajet actif
 */
exports.checkCamionUnique = async (camionId, excludeTrajetId = null) => {
  const conflict = await Trajet.findOne({
    _id: { $ne: excludeTrajetId },
    camion: camionId,
    status: 'en_cours'
  });
  if (conflict)
    throw new ApiError(409, 'Ce camion a déjà un trajet actif');
};