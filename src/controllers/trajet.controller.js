const asyncHandler = require('../utils/asyncHandler');
const trajetService = require('../services/trajet.service');


exports.createTrajet = asyncHandler(async (req, res) => {
  const trajet = await trajetService.createTrajet(req.body);
  res.status(201).json({
    success: true,
    message: 'Trajet créé',
    data: trajet
  });
});


exports.getAllTrajets = asyncHandler(async (req, res) => {
  const trajets = await trajetService.getAllTrajets(req.query);
  res.status(200).json({
    success: true,
    count: trajets.length,
    data: trajets
  });
});


exports.getMyTrajets = asyncHandler(async (req, res) => {
  const trajets = await trajetService.getTrajetsByChauffeur(req.user._id, req.query);
  res.status(200).json({ success: true, data: trajets });
});


exports.getTrajetById = asyncHandler(async (req, res) => {
  const trajet = await trajetService.getTrajetById(req.params.id, req.user);
  res.status(200).json({ success: true, data: trajet });
});


exports.updateTrajet = asyncHandler(async (req, res) => {
  const trajet = await trajetService.updateTrajet(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: 'Trajet mis à jour',
    data: trajet
  });
});


exports.deleteTrajet = asyncHandler(async (req, res) => {
  await trajetService.deleteTrajet(req.params.id);
  res.status(200).json({ success: true, message: 'Trajet supprimé' });
});


exports.assignTrajet = asyncHandler(async (req, res) => {
  const { chauffeurId, camionId, remorqueId } = req.body;
  const trajet = await trajetService.assignTrajet(
    req.params.id,
    chauffeurId,
    camionId,
    remorqueId
  );
  res.status(200).json({
    success: true,
    message: 'Trajet assigné avec succès',
    data: trajet
  });
});


exports.updateStatut = asyncHandler(async (req, res) => {
  const trajet = await trajetService.updateStatut(
    req.params.id,
    req.body.status,
    req.user
  );
  res.status(200).json({
    success: true,
    message: 'Statut mis à jour',
    data: trajet
  });
});


exports.saisirKilometrage = asyncHandler(async (req, res) => {
  const { kmDepart, kmArrivee } = req.body;
  const trajet = await trajetService.saisirKilometrage(
    req.params.id,
    kmDepart,
    kmArrivee,
    req.user
  );
  res.status(200).json({
    success: true,
    message: 'Kilométrage enregistré',
    data: trajet
  });
});


exports.saisirCarburant = asyncHandler(async (req, res) => {
  const { volumeGasoil, coutGasoil } = req.body;
  const trajet = await trajetService.saisirCarburant(
    req.params.id,
    volumeGasoil,
    coutGasoil,
    req.user
  );
  res.status(200).json({
    success: true,
    message: 'Carburant enregistré',
    data: trajet
  });
});


exports.ajouterRemarque = asyncHandler(async (req, res) => {
  const trajet = await trajetService.ajouterRemarque(
    req.params.id,
    req.body.remarques,
    req.user
  );
  res.status(200).json({
    success: true,
    message: 'Remarque ajoutée',
    data: trajet
  });
});