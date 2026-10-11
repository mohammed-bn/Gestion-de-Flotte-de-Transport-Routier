const asyncHandler = require('../utils/asyncHandler');
const missionService = require('../services/mission.service');


exports.createMission = asyncHandler(async (req, res) => {
  const mission = await missionService.createMission(req.body);
  res.status(201).json({
    success: true,
    message: 'Mission créée',
    data: mission
  });
});


exports.getAllMissions = asyncHandler(async (req, res) => {
  const missions = await missionService.getAllMissions(req.query);
  res.status(200).json({
    success: true,
    count: missions.length,
    data: missions
  });
});


exports.getMissionById = asyncHandler(async (req, res) => {
  const mission = await missionService.getMissionById(req.params.id, req.user);
  res.status(200).json({ success: true, data: mission });
});


exports.updateMission = asyncHandler(async (req, res) => {
  const mission = await missionService.updateMission(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: 'Mission mise à jour',
    data: mission
  });
});


exports.deleteMission = asyncHandler(async (req, res) => {
  await missionService.deleteMission(req.params.id);
  res.status(200).json({ success: true, message: 'Mission supprimée' });
});


exports.generatePDF = asyncHandler(async (req, res) => {
  const pdfBuffer = await missionService.generatePDF(req.params.id, req.user);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=ordre-mission-${req.params.id}.pdf`
  );
  res.send(pdfBuffer);
});


exports.getMyMissions = asyncHandler(async (req, res) => {
  const missions = await missionService.getMissionsByChauffeur(req.user._id);
  res.status(200).json({ success: true, data: missions });
});