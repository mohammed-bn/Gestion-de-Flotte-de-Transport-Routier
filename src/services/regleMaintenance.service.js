const RegleMaintenance = require('../models/RegleMaintenance');
const ApiError = require('../utils/ApiError');

/* ============ CRUD ============ */

exports.createRegle = async (data) => {
  const exists = await RegleMaintenance.findOne({ type: data.type });
  if (exists) throw new ApiError(409, `Une règle pour "${data.type}" existe déjà`);

  return RegleMaintenance.create(data);
};

exports.getAllRegles = async (filters = {}) => {
  const query = {};
  if (filters.actif !== undefined) query.actif = filters.actif === 'true';
  if (filters.type) query.type = filters.type;

  return RegleMaintenance.find(query).sort({ type: 1 });
};

exports.getRegleById = async (id) => {
  const regle = await RegleMaintenance.findById(id);
  if (!regle) throw new ApiError(404, 'Règle de maintenance introuvable');
  return regle;
};

exports.getRegleByType = async (type) => {
  const regle = await RegleMaintenance.findOne({ type, actif: true });
  if (!regle) throw new ApiError(404, `Aucune règle active pour "${type}"`);
  return regle;
};

exports.updateRegle = async (id, data) => {
  // Si on change le type, vérifier l'unicité
  if (data.type) {
    const exists = await RegleMaintenance.findOne({
      type: data.type,
      _id: { $ne: id }
    });
    if (exists) throw new ApiError(409, `Une règle pour "${data.type}" existe déjà`);
  }

  const regle = await RegleMaintenance.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  });
  if (!regle) throw new ApiError(404, 'Règle de maintenance introuvable');
  return regle;
};

exports.deleteRegle = async (id) => {
  const regle = await RegleMaintenance.findByIdAndDelete(id);
  if (!regle) throw new ApiError(404, 'Règle de maintenance introuvable');
  return regle;
};

exports.toggleRegle = async (id) => {
  const regle = await RegleMaintenance.findById(id);
  if (!regle) throw new ApiError(404, 'Règle de maintenance introuvable');

  regle.actif = !regle.actif;
  await regle.save();
  return regle;
};

/* ============ LOGIQUE MÉTIER ============ */

/**
 * Récupère toutes les règles actives sous forme de map { type: seuilKm }
 * Utilisé par maintenance.service.js pour vérifier les seuils.
 */
exports.getSeuilsActifs = async () => {
  const regles = await RegleMaintenance.find({ actif: true });
  return regles.reduce((acc, r) => {
    acc[r.type] = { seuilKm: r.seuilKm, seuilJours: r.seuilJours };
    return acc;
  }, {});
};

/**
 * Calcule le km restant avant la prochaine maintenance
 * d'un véhicule pour un type donné.
 */
exports.getKmRestant = async (type, kilometrageActuel, dernierKm) => {
  const regle = await exports.getRegleByType(type);
  const kmDepuisDerniere = kilometrageActuel - dernierKm;
  return Math.max(0, regle.seuilKm - kmDepuisDerniere);
};

/**
 * Initialise les règles par défaut (à appeler dans un seed).
 */
exports.seedDefaultRegles = async () => {
  const defaults = [
    { type: 'vidange', seuilKm: 10000, description: 'Vidange moteur tous les 10 000 km' },
    { type: 'revision', seuilKm: 20000, description: 'Révision complète tous les 20 000 km' },
    { type: 'pneus', seuilKm: 80000, description: 'Remplacement pneus tous les 80 000 km' },
    { type: 'controle_technique', seuilKm: 0, seuilJours: 365, description: 'CT annuel' },
    { type: 'assurance', seuilKm: 0, seuilJours: 365, description: 'Assurance annuelle' }
  ];

  for (const r of defaults) {
    await RegleMaintenance.updateOne(
      { type: r.type },
      { $setOnInsert: r },
      { upsert: true }
    );
  }

  return RegleMaintenance.find();
};