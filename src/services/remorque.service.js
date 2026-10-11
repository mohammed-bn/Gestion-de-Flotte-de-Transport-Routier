const SemiRemorque = require('../models/SemiRemorque');
const ApiError = require('../utils/ApiError');

exports.createRemorque = async (data) => {
  const exists = await SemiRemorque.findOne({
    registrationNumber: data.registrationNumber.toUpperCase()
  });
  if (exists) throw new ApiError(409, 'Immatriculation déjà utilisée');

  return SemiRemorque.create(data);
};

exports.getAllRemorques = async (filters = {}) => {
  const query = { isArchived: false };
  if (filters.status) query.status = filters.status;
  if (filters.type) query.type = filters.type;

  return SemiRemorque.find(query)
    .populate('pneus')
    .sort({ createdAt: -1 });
};

exports.getRemorqueById = async (id) => {
  const remorque = await SemiRemorque.findById(id).populate('pneus');
  if (!remorque) throw new ApiError(404, 'Remorque introuvable');
  return remorque;
};

exports.updateRemorque = async (id, data) => {
  const remorque = await SemiRemorque.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  }).populate('pneus');
  if (!remorque) throw new ApiError(404, 'Remorque introuvable');
  return remorque;
};

exports.archiveRemorque = async (id) => {
  const remorque = await SemiRemorque.findByIdAndUpdate(
    id,
    { isArchived: true, status: 'archive' },
    { new: true }
  );
  if (!remorque) throw new ApiError(404, 'Remorque introuvable');
  return remorque;
};

exports.updateStatus = async (id, status) => {
  const remorque = await SemiRemorque.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
  if (!remorque) throw new ApiError(404, 'Remorque introuvable');
  return remorque;
};

exports.getDisponibles = async () => {
  return SemiRemorque.find({
    isArchived: false,
    status: 'disponible',
    maintenanceAlert: false
  });
};