const asyncHandler = require('../utils/asyncHandler');
const maintenanceService = require('../services/maintenance.service');


exports.createProbleme = asyncHandler(async (req, res) => {
  const probleme = await maintenanceService.createProbleme(req.body, req.user);
  res.status(201).json({
    success: true,
    message: 'Problème signalé',
    data: probleme
  });
});


exports.getAllProblemes = asyncHandler(async (req, res) => {
  const problemes = await maintenanceService.getAllProblemes(req.query);
  res.status(200).json({
    success: true,
    count: problemes.length,
    data: problemes
  });
});


exports.getProblemeById = asyncHandler(async (req, res) => {
  const probleme = await maintenanceService.getProblemeById(req.params.id);
  res.status(200).json({ success: true, data: probleme });
});


exports.updateProbleme = asyncHandler(async (req, res) => {
  const probleme = await maintenanceService.updateProbleme(req.params.id, req.body);
  res.status(200).json({ success: true, data: probleme });
});


exports.deleteProbleme = asyncHandler(async (req, res) => {
  await maintenanceService.deleteProbleme(req.params.id);
  res.status(200).json({ success: true, message: 'Problème supprimé' });
});

//maintenances MAINTENANCES


exports.createMaintenance = asyncHandler(async (req, res) => {
  const maintenance = await maintenanceService.createMaintenance(req.body);
  res.status(201).json({
    success: true,
    message: 'Maintenance créée',
    data: maintenance
  });
});


exports.getAllMaintenances = asyncHandler(async (req, res) => {
  const maintenances = await maintenanceService.getAllMaintenances(req.query);
  res.status(200).json({
    success: true,
    count: maintenances.length,
    data: maintenances
  });
});


exports.getMaintenanceById = asyncHandler(async (req, res) => {
  const maintenance = await maintenanceService.getMaintenanceById(req.params.id);
  res.status(200).json({ success: true, data: maintenance });
});


exports.updateMaintenance = asyncHandler(async (req, res) => {
  const maintenance = await maintenanceService.updateMaintenance(req.params.id, req.body);
  res.status(200).json({ success: true, data: maintenance });
});


exports.deleteMaintenance = asyncHandler(async (req, res) => {
  await maintenanceService.deleteMaintenance(req.params.id);
  res.status(200).json({ success: true, message: 'Maintenance supprimée' });
});




exports.getAlertes = asyncHandler(async (req, res) => {
  const alertes = await maintenanceService.getAlertes();
  res.status(200).json({ success: true, data: alertes });
});


exports.resolveAlerte = asyncHandler(async (req, res) => {
  const result = await maintenanceService.resolveAlerte(req.params.id);
  res.status(200).json({
    success: true,
    message: 'Alerte résolue',
    data: result
  });
});


exports.getHistoriqueVehicule = asyncHandler(async (req, res) => {
  const historique = await maintenanceService.getHistoriqueVehicule(req.params.id);
  res.status(200).json({ success: true, data: historique });
});