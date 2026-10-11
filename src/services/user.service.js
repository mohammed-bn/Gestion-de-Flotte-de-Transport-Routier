const User = require('../models/User');
const ApiError = require('../utils/ApiError');

exports.createUser = async (data) => {
  const exists = await User.findOne({
    $or: [{ email: data.email }, { phone: data.phone }, { CIN: data.CIN }]
  });
  if (exists) throw new ApiError(409, 'Utilisateur déjà existant');

  const user = await User.create(data);
  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

exports.getAllUsers = async (filters = {}) => {
  const query = {};
  if (filters.role) query.role = filters.role;
  if (filters.status) query.statusUser = filters.status;
  if (filters.search) {
    query.$or = [
      { firstName: new RegExp(filters.search, 'i') },
      { lastName: new RegExp(filters.search, 'i') },
      { email: new RegExp(filters.search, 'i') }
    ];
  }
  return User.find(query).populate('role').select('-password -refreshToken');
};

exports.getUserById = async (id) => {
  const user = await User.findById(id)
    .populate('role')
    .select('-password -refreshToken');
  if (!user) throw new ApiError(404, 'Utilisateur introuvable');
  return user;
};

exports.updateUser = async (id, data) => {
  delete data.password;
  delete data.refreshToken;

  const user = await User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  })
    .populate('role')
    .select('-password -refreshToken');

  if (!user) throw new ApiError(404, 'Utilisateur introuvable');
  return user;
};

exports.deleteUser = async (id) => {
  const user = await User.findByIdAndUpdate(
    id,
    { statusUser: 'inactif' },
    { new: true }
  );
  if (!user) throw new ApiError(404, 'Utilisateur introuvable');
  return user;
};

exports.changeStatus = async (id, status) => {
  const user = await User.findByIdAndUpdate(
    id,
    { statusUser: status },
    { new: true }
  ).populate('role');
  if (!user) throw new ApiError(404, 'Utilisateur introuvable');
  return user;
};