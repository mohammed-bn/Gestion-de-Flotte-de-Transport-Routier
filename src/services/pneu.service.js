const Pneu = require('../models/Pneu');
const TracteurRoutier = require('../models/TracteurRoutier');
const SemiRemorque = require('../models/SemiRemorque');
const ApiError = require('../utils/ApiError');

exports.createPneu = async (data) => {
  const pneu = await Pneu.create(data);
  await attachPneuToVehicule(pneu);
  return pneu;
};

exports.getAllPneus = async (filters = {}) => {
  const query = {};
  if (filters.vehiculeId) query.vehiculeId = filters.vehiculeId;
  if (filters.vehiculeType) query.vehiculeType = filters.vehiculeType;
  if (filters.needsReplacement !== undefined)
    query.needsReplacement = filters.needsReplacement === 'true';

  return Pneu.find(query).sort({ createdAt: -1 });
};

exports.getPneuById = async (id) => {
  const pneu = await Pneu.findById(id);
  if (!pneu) throw new ApiError(404, 'Pneu introuvable');
  return pneu;
};

exports.updatePneu = async (id, data) => {
  const pneu = await Pneu.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  });
  if (!pneu) throw new ApiError(404, 'Pneu introuvable');

  // Vérifier usure après mise à jour
  pneu.checkUsure();
  await pneu.save();

  return pneu;
};

exports.deletePneu = async (id) => {
  const pneu = await Pneu.findByIdAndDelete(id);
  if (!pneu) throw new ApiError(404, 'Pneu introuvable');

  // Retirer du véhicule
  if (pneu.vehiculeType === 'TracteurRoutier') {
    await TracteurRoutier.findByIdAndUpdate(pneu.vehiculeId, {
      $pull: { pneus: pneu._id }
    });
  } else {
    await SemiRemorque.findByIdAndUpdate(pneu.vehiculeId, {
      $pull: { pneus: pneu._id }
    });
  }

  return pneu;
};

exports.assignToVehicule = async (pneuId, vehiculeId, vehiculeType, position) => {
  const pneu = await Pneu.findById(pneuId);
  if (!pneu) throw new ApiError(404, 'Pneu introuvable');

  // Retirer de l'ancien véhicule
  if (pneu.vehiculeId) {
    if (pneu.vehiculeType === 'TracteurRoutier') {
      await TracteurRoutier.findByIdAndUpdate(pneu.vehiculeId, {
        $pull: { pneus: pneu._id }
      });
    } else {
      await SemiRemorque.findByIdAndUpdate(pneu.vehiculeId, {
        $pull: { pneus: pneu._id }
      });
    }
  }

  // Vérifier nouveau véhicule
  const Model = vehiculeType === 'TracteurRoutier' ? TracteurRoutier : SemiRemorque;
  const vehicule = await Model.findById(vehiculeId);
  if (!vehicule) throw new ApiError(404, 'Véhicule introuvable');

  pneu.vehiculeId = vehiculeId;
  pneu.vehiculeType = vehiculeType;
  if (position) pneu.position = position;
  await pneu.save();

  await attachPneuToVehicule(pneu);
  return pneu;
};

exports.replacePneu = async (id, data) => {
  const pneu = await Pneu.findById(id);
  if (!pneu) throw new ApiError(404, 'Pneu introuvable');

  pneu.installationDate = new Date();
  pneu.kmInstallation = data.kmActuel || 0;
  pneu.kmUsure = 0;
  pneu.needsReplacement = false;
  if (data.reference) pneu.reference = data.reference;
  if (data.brand) pneu.brand = data.brand;
  if (data.seuilKm) pneu.seuilKm = data.seuilKm;

  await pneu.save();
  return pneu;
};

exports.getPneusEnAlerte = async () => {
  return Pneu.find({ needsReplacement: true })
    .populate('vehiculeId');
};

exports.updateKmUsure = async (id, kmUsure) => {
  const pneu = await Pneu.findById(id);
  if (!pneu) throw new ApiError(404, 'Pneu introuvable');

  pneu.kmUsure = kmUsure;
  pneu.checkUsure();
  await pneu.save();

  return pneu;
};

/* ============ HELPER PRIVÉ ============ */
async function attachPneuToVehicule(pneu) {
  const Model = pneu.vehiculeType === 'TracteurRoutier'
    ? TracteurRoutier
    : SemiRemorque;

  await Model.findByIdAndUpdate(pneu.vehiculeId, {
    $addToSet: { pneus: pneu._id }
  });
}