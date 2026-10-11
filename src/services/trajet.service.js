const Trajet = require("../models/Trajet");
const TracteurRoutier = require("../models/TracteurRoutier");
const SemiRemorque = require("../models/SemiRemorque");
const ApiError = require("../utils/ApiError");
const disponibiliteService = require("./disponibilite.service");
const maintenanceService = require("./maintenance.service");

exports.createTrajet = async (data) => {
  return Trajet.create(data);
};

exports.getAllTrajets = async (filters = {}) => {
  const query = {};
  if (filters.status) query.status = filters.status;
  if (filters.chauffeur) query.chauffeur = filters.chauffeur;
  if (filters.camion) query.camion = filters.camion;

  return Trajet.find(query)
    .populate("chauffeur", "firstName lastName email")
    .populate("camion", "registrationNumber brand model")
    .populate("remorque", "registrationNumber brand")
    .sort({ createdAt: -1 });
};

exports.getTrajetById = async (id, user) => {
  const trajet = await Trajet.findById(id)
    .populate("chauffeur", "firstName lastName email phone")
    .populate("camion")
    .populate("remorque");

  if (!trajet) throw new ApiError(404, "Trajet introuvable");

  if (
    user.role.role === "chauffeur" &&
    (!trajet.chauffeur ||
      trajet.chauffeur._id.toString() !== user._id.toString())
  ) {
    throw new ApiError(403, "Accès interdit à ce trajet");
  }

  return trajet;
};

exports.getTrajetsByChauffeur = async (chauffeurId, filters = {}) => {
  const query = { chauffeur: chauffeurId };
  if (filters.status) query.status = filters.status;

  return Trajet.find(query)
    .populate("camion", "registrationNumber brand")
    .populate("remorque", "registrationNumber brand")
    .sort({ departureDateTime: -1 });
};

exports.updateTrajet = async (id, data) => {
  const trajet = await Trajet.findById(id);
  if (!trajet) throw new ApiError(404, "Trajet introuvable");

  if (trajet.chauffeur && (data.departureDateTime || data.arrivalDateTime)) {
    await disponibiliteService.checkDisponibilite({
      chauffeurId: trajet.chauffeur,
      camionId: trajet.camion,
      remorqueId: trajet.remorque,
      departureDateTime: data.departureDateTime || trajet.departureDateTime,
      arrivalDateTime: data.arrivalDateTime || trajet.arrivalDateTime,
      excludeTrajetId: id,
    });
  }

  return Trajet.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

exports.deleteTrajet = async (id) => {
  const trajet = await Trajet.findById(id);
  if (!trajet) throw new ApiError(404, "Trajet introuvable");
  if (trajet.status === "en_cours")
    throw new ApiError(400, "Impossible de supprimer un trajet en cours");

  await trajet.deleteOne();
  return trajet;
};

exports.assignTrajet = async (trajetId, chauffeurId, camionId, remorqueId) => {
  const trajet = await Trajet.findById(trajetId);
  if (!trajet) throw new ApiError(404, "Trajet introuvable");

  await disponibiliteService.checkDisponibilite({
    chauffeurId,
    camionId,
    remorqueId,
    departureDateTime: trajet.departureDateTime,
    arrivalDateTime: trajet.arrivalDateTime,
    excludeTrajetId: trajetId,
  });

  trajet.chauffeur = chauffeurId;
  trajet.camion = camionId;
  trajet.remorque = remorqueId;
  await trajet.save();

  await TracteurRoutier.findByIdAndUpdate(camionId, { status: "en_mission" });
  await SemiRemorque.findByIdAndUpdate(remorqueId, { status: "en_mission" });

  return trajet.populate([
    { path: "chauffeur", select: "firstName lastName email" },
    { path: "camion", select: "registrationNumber brand model" },
    { path: "remorque", select: "registrationNumber brand" },
  ]);
};

const TRANSITIONS_VALIDES = {
  a_faire: ["en_cours"],
  en_cours: ["termine"],
  termine: [],
};

exports.updateStatut = async (id, newStatus, user) => {
  const trajet = await Trajet.findById(id);
  if (!trajet) throw new ApiError(404, "Trajet introuvable");

  if (
    user.role.role === "chauffeur" &&
    trajet.chauffeur.toString() !== user._id.toString()
  ) {
    throw new ApiError(403, "Accès interdit");
  }

  const allowed = TRANSITIONS_VALIDES[trajet.status] || [];
  if (!allowed.includes(newStatus)) {
    throw new ApiError(
      400,
      `Transition invalide: ${trajet.status} → ${newStatus}. Ordre requis: à faire → en cours → terminé`,
    );
  }

  trajet.status = newStatus;

  if (newStatus === "termine") {
    if (trajet.camion) {
      await TracteurRoutier.findByIdAndUpdate(trajet.camion, {
        status: "disponible",
      });
    }
    if (trajet.remorque) {
      await SemiRemorque.findByIdAndUpdate(trajet.remorque, {
        status: "disponible",
      });
    }
  }

  await trajet.save();
  return trajet;
};

exports.saisirKilometrage = async (id, kmDepart, kmArrivee, user) => {
  const trajet = await Trajet.findById(id);
  if (!trajet) throw new ApiError(404, "Trajet introuvable");

  if (
    user.role.role === "chauffeur" &&
    trajet.chauffeur.toString() !== user._id.toString()
  ) {
    throw new ApiError(403, "Accès interdit");
  }

  if (kmArrivee !== undefined && kmArrivee !== null) {
    const depart = kmDepart !== undefined ? kmDepart : trajet.kmDepart;
    if (kmArrivee <= depart) {
      throw new ApiError(
        400,
        "Le kilométrage d'arrivée doit être strictement supérieur au kilométrage de départ",
      );
    }
  }

  if (kmDepart !== undefined) trajet.kmDepart = kmDepart;
  if (kmArrivee !== undefined) trajet.kmArrivee = kmArrivee;

  trajet.calculerKmTotal();
  trajet.calculerConsommation();

  await trajet.save();

  if (trajet.camion && trajet.kmTotal > 0) {
    await maintenanceService.checkSeuilsApresTrajet(
      trajet.camion,
      trajet.kmTotal,
    );
  }
  if (trajet.remorque && trajet.kmTotal > 0) {
    await maintenanceService.checkSeuilsApresTrajet(
      trajet.remorque,
      trajet.kmTotal,
    );
  }

  return trajet;
};

exports.saisirCarburant = async (id, volumeGasoil, coutGasoil, user) => {
  const trajet = await Trajet.findById(id);
  if (!trajet) throw new ApiError(404, "Trajet introuvable");

  if (
    user.role.role === "chauffeur" &&
    trajet.chauffeur.toString() !== user._id.toString()
  ) {
    throw new ApiError(403, "Accès interdit");
  }

  trajet.volumeGasoil = volumeGasoil;
  if (coutGasoil !== undefined) trajet.coutGasoil = coutGasoil;

  trajet.calculerConsommation();
  await trajet.save();

  return trajet;
};

exports.ajouterRemarque = async (id, remarques, user) => {
  const trajet = await Trajet.findById(id);
  if (!trajet) throw new ApiError(404, "Trajet introuvable");

  if (
    user.role.role === "chauffeur" &&
    trajet.chauffeur.toString() !== user._id.toString()
  ) {
    throw new ApiError(403, "Accès interdit");
  }

  trajet.remarques = remarques;
  await trajet.save();
  return trajet;
};
