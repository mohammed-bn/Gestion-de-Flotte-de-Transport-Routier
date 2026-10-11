const asyncHandler = require('../utils/asyncHandler');
const camionService = require('../services/camion.service');


exports.createCamion = asyncHandler(async (req, res) => {
  const camion = await camionService.createCamion(req.body);
  res.status(201).json({
    success: true,
    message: 'Camion créé avec succès',
    data: camion
  });
});


exports.getAllCamions = asyncHandler(async (req, res) => {
  const camions = await camionService.getAllCamions(req.query);
  res.status(200).json({
    success: true,
    count: camions.length,
    data: camions
  });
});


exports.getCamionById = asyncHandler(async (req, res) => {
  const camion = await camionService.getCamionById(req.params.id);
  res.status(200).json({ success: true, data: camion });
});


exports.updateCamion = asyncHandler(async (req, res) => {
  const camion = await camionService.updateCamion(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: 'Camion mis à jour',
    data: camion
  });
});


exports.archiveCamion = asyncHandler(async (req, res) => {
  await camionService.archiveCamion(req.params.id);
  res.status(200).json({
    success: true,
    message: 'Camion archivé'
  });
});


exports.updateStatus = asyncHandler(async (req, res) => {
  const camion = await camionService.updateStatus(req.params.id, req.body.status);
  res.status(200).json({
    success: true,
    message: 'Statut mis à jour',
    data: camion
  });
});


exports.getDisponibles = asyncHandler(async (req, res) => {
  const camions = await camionService.getDisponibles(req.query);
  res.status(200).json({ success: true, data: camions });
});