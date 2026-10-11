const asyncHandler = require('../utils/asyncHandler');
const carburantService = require('../services/carburant.service');


exports.createCarburant = asyncHandler(async (req, res) => {
  const carburant = await carburantService.createCarburant(req.body, req.user);
  res.status(201).json({
    success: true,
    message: 'Plein enregistré',
    data: carburant
  });
});


exports.getAllCarburants = asyncHandler(async (req, res) => {
  const carburants = await carburantService.getAllCarburants(req.query);
  res.status(200).json({
    success: true,
    count: carburants.length,
    data: carburants
  });
});


exports.getCarburantById = asyncHandler(async (req, res) => {
  const carburant = await carburantService.getCarburantById(req.params.id);
  res.status(200).json({ success: true, data: carburant });
});


exports.updateCarburant = asyncHandler(async (req, res) => {
  const carburant = await carburantService.updateCarburant(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: 'Plein mis à jour',
    data: carburant
  });
});


exports.deleteCarburant = asyncHandler(async (req, res) => {
  await carburantService.deleteCarburant(req.params.id);
  res.status(200).json({ success: true, message: 'Plein supprimé' });
});


exports.getByCamion = asyncHandler(async (req, res) => {
  const carburants = await carburantService.getByCamion(req.params.id);
  res.status(200).json({ success: true, data: carburants });
});


exports.getConsommationMoyenne = asyncHandler(async (req, res) => {
  const stats = await carburantService.getConsommationMoyenne(req.params.camionId);
  res.status(200).json({ success: true, data: stats });
});