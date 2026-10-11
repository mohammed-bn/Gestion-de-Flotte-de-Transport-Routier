const asyncHandler = require('../utils/asyncHandler');
const pneuService = require('../services/pneu.service');


exports.createPneu = asyncHandler(async (req, res) => {
  const pneu = await pneuService.createPneu(req.body);
  res.status(201).json({
    success: true,
    message: 'Pneu ajouté',
    data: pneu
  });
});


exports.getAllPneus = asyncHandler(async (req, res) => {
  const pneus = await pneuService.getAllPneus(req.query);
  res.status(200).json({
    success: true,
    count: pneus.length,
    data: pneus
  });
});


exports.getPneuById = asyncHandler(async (req, res) => {
  const pneu = await pneuService.getPneuById(req.params.id);
  res.status(200).json({ success: true, data: pneu });
});


exports.updatePneu = asyncHandler(async (req, res) => {
  const pneu = await pneuService.updatePneu(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: 'Pneu mis à jour',
    data: pneu
  });
});


exports.deletePneu = asyncHandler(async (req, res) => {
  await pneuService.deletePneu(req.params.id);
  res.status(200).json({ success: true, message: 'Pneu supprimé' });
});


exports.assignToVehicule = asyncHandler(async (req, res) => {
  const { vehiculeId, vehiculeType, position } = req.body;
  const pneu = await pneuService.assignToVehicule(
    req.params.id,
    vehiculeId,
    vehiculeType,
    position
  );
  res.status(200).json({
    success: true,
    message: 'Pneu associé au véhicule',
    data: pneu
  });
});


exports.replacePneu = asyncHandler(async (req, res) => {
  const pneu = await pneuService.replacePneu(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: 'Pneu remplacé',
    data: pneu
  });
});


exports.getPneusEnAlerte = asyncHandler(async (req, res) => {
  const pneus = await pneuService.getPneusEnAlerte();
  res.status(200).json({ success: true, data: pneus });
});


exports.updateKmUsure = asyncHandler(async (req, res) => {
  const pneu = await pneuService.updateKmUsure(req.params.id, req.body.kmUsure);
  res.status(200).json({ success: true, data: pneu });
});