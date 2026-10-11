const asyncHandler = require('../utils/asyncHandler');
const regleService = require('../services/regleMaintenance.service');


exports.createRegle = asyncHandler(async (req, res) => {
  const regle = await regleService.createRegle(req.body);
  res.status(201).json({
    success: true,
    message: 'Règle créée',
    data: regle
  });
});


exports.getAllRegles = asyncHandler(async (req, res) => {
  const regles = await regleService.getAllRegles();
  res.status(200).json({
    success: true,
    message: 'ok test',
    data : regles
      });
});