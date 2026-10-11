const Mission = require('../models/Mission');
const ApiError = require('../utils/ApiError');
const pdfService = require('./pdf.service');

exports.createMission = async (data) => {
  return Mission.create(data);
};

exports.getAllMissions = async (filters = {}) => {
  const query = {};
  if (filters.status) query.status = filters.status;
  if (filters.chauffeur) query.chauffeur = filters.chauffeur;

  return Mission.find(query)
    .populate('chauffeur', 'firstName lastName')
    .populate('camion', 'registrationNumber brand')
    .populate('remorque', 'registrationNumber brand')
    .sort({ createdAt: -1 });
};

exports.getMissionById = async (id, user) => {
  const mission = await Mission.findById(id)
    .populate('chauffeur', 'firstName lastName email phone')
    .populate('camion')
    .populate('remorque');

  if (!mission) throw new ApiError(404, 'Mission introuvable');

  if (user.role.role === 'chauffeur' &&
      mission.chauffeur?._id.toString() !== user._id.toString()) {
    throw new ApiError(403, 'Accès interdit');
  }

  return mission;
};

exports.updateMission = async (id, data) => {
  const mission = await Mission.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  });
  if (!mission) throw new ApiError(404, 'Mission introuvable');
  return mission;
};

exports.deleteMission = async (id) => {
  const mission = await Mission.findByIdAndDelete(id);
  if (!mission) throw new ApiError(404, 'Mission introuvable');
  return mission;
};

exports.getMissionsByChauffeur = async (chauffeurId) => {
  return Mission.find({ chauffeur: chauffeurId }).sort({ startDateTime: -1 });
};

exports.generatePDF = async (id, user) => {
  const mission = await Mission.findById(id)
    .populate('chauffeur', 'firstName lastName phone drivingLicenseNumber')
    .populate('camion', 'registrationNumber brand model mileage')
    .populate('remorque', 'registrationNumber brand type maxLoad');

  if (!mission) throw new ApiError(404, 'Mission introuvable');

  if (user.role.role === 'chauffeur' &&
      mission.chauffeur?._id.toString() !== user._id.toString()) {
    throw new ApiError(403, 'Accès interdit');
  }

  return pdfService.generateOrdreMission(mission);
};