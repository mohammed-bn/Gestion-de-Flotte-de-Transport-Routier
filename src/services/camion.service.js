const TracteurRoutier = require('../models/TracteurRoutier');
const ApiError = require('../utils/ApiError');

exports.createCamion = async (data) => {
  const exists = await TracteurRoutier.findOne({
    registrationNumber: data.registrationNumber.toUpperCase()
  });
  if (exists) throw new ApiError(409, 'Immatriculation déjà utilisée');

  return TracteurRoutier.create(data);
};

exports.getAllCamions = async (filters = {}) => {
  const query = { isArchived: false };
  if (filters.status) query.status = filters.status;
  if (filters.vehicleType) query.vehicleType = filters.vehicleType;
  if (filters.search) {
    query.$or = [
      { registrationNumber: new RegExp(filters.search, 'i') },
      { brand: new RegExp(filters.search, 'i') },
      { model: new RegExp(filters.search, 'i') }
    ];
  }
  return TracteurRoutier.find(query)
    .populate('pneus')
    .sort({ createdAt: -1 });
};

exports.getCamionById = async (id) => {
  const camion = await TracteurRoutier.findById(id).populate('pneus');
  if (!camion) throw new ApiError(404, 'Camion introuvable');
  return camion;
};

exports.updateCamion = async (id, data) => {
  const camion = await TracteurRoutier.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  }).populate('pneus');
  if (!camion) throw new ApiError(404, 'Camion introuvable');
  return camion;
};

exports.archiveCamion = async (id) => {
  const camion = await TracteurRoutier.findByIdAndUpdate(
    id,
    { isArchived: true, status: 'archive' },
    { new: true }
  );
  if (!camion) throw new ApiError(404, 'Camion introuvable');
  return camion;
};

exports.updateStatus = async (id, status) => {
  const camion = await TracteurRoutier.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
  if (!camion) throw new ApiError(404, 'Camion introuvable');
  return camion;
};

exports.getDisponibles = async (filters = {}) => {
  return TracteurRoutier.find({
    isArchived: false,
    status: 'disponible',
    maintenanceAlert: false
  });
};