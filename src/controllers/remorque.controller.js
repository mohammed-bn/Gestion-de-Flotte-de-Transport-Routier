const asyncHandler = require('../utils/asyncHandler');
const remorqueService = require('../services/remorque.service');


exports.createRemorque = asyncHandler(async (req, res) => {
  const remorque = await remorqueService.createRemorque(req.body);
  res.status(201).json({
    success: true,
    message: 'Remorque créée',
    data: remorque
  });
});


exports.getAllRemorques = asyncHandler(async (req, res) => {
  const remorques = await remorqueService.getAllRemorques(req.query);
  res.status(200).json({
    success: true,
    count: remorques.length,
    data: remorques
  });
});


exports.getRemorqueById = asyncHandler(async (req, res) => {
  const remorque = await remorqueService.getRemorqueById(req.params.id);
  res.status(200).json({ success: true, data: remorque });
});


exports.updateRemorque = asyncHandler(async (req, res) => {
  const remorque = await remorqueService.updateRemorque(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: 'Remorque mise à jour',
    data: remorque
  });
});


exports.archiveRemorque = asyncHandler(async (req, res) => {
  await remorqueService.archiveRemorque(req.params.id);
  res.status(200).json({ success: true, message: 'Remorque archivée' });
});


exports.updateStatus = asyncHandler(async (req, res) => {
  const remorque = await remorqueService.updateStatus(req.params.id, req.body.status);
  res.status(200).json({ success: true, data: remorque });
});


exports.getDisponibles = asyncHandler(async (req, res) => {
  const remorques = await remorqueService.getDisponibles(req.query);
  res.status(200).json({ success: true, data: remorques });
});