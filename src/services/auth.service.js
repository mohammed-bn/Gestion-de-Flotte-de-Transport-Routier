const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d' }
  );
};

exports.register = async (data) => {
  const exists = await User.findOne({
    $or: [{ email: data.email }, { phone: data.phone }, { CIN: data.CIN }]
  });
  if (exists) throw new ApiError(409, 'Email, téléphone ou CIN déjà utilisé');

  const user = await User.create(data);
  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

exports.login = async (email, password) => {
  const user = await User.findOne({ email })
    .select('+password')
    .populate('role');

  if (!user) throw new ApiError(401, 'Identifiants invalides');

  if (user.statusUser === 'suspendu')
    throw new ApiError(403, 'Compte suspendu. Contactez l\'administrateur.');

  if (user.statusUser === 'inactif')
    throw new ApiError(403, 'Compte inactif');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, 'Identifiants invalides');

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;

  return { user: userObj, accessToken, refreshToken };
};

exports.refreshToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).populate('role');

    if (!user) throw new ApiError(401, 'Utilisateur introuvable');
    if (user.statusUser === 'suspendu')
      throw new ApiError(403, 'Compte suspendu');
    if (user.refreshToken !== token)
      throw new ApiError(401, 'Refresh token invalide');

    const newAccessToken = generateAccessToken(user);
    return { accessToken: newAccessToken };
  } catch (err) {
    throw new ApiError(401, 'Refresh token expiré ou invalide');
  }
};

exports.logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};

exports.getMe = async (userId) => {
  const user = await User.findById(userId)
    .populate('role')
    .select('-password -refreshToken');
  if (!user) throw new ApiError(404, 'Utilisateur introuvable');
  return user;
};

exports.changePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  if (!user) throw new ApiError(404, 'Utilisateur introuvable');

  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) throw new ApiError(400, 'Ancien mot de passe incorrect');

  user.password = newPassword;
  await user.save();
};