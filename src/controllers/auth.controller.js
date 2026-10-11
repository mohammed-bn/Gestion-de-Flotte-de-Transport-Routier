const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const authService = require('../services/auth.service');


exports.register = asyncHandler(async (req, res) => {
    console.log("Request body:", req.body);
  const user = await authService.register(req.body);
  res.status(201).json({
    success: true,
    message: 'Compte créé avec succès',
    data: user
  });
});


exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.status(200).json({
    success: true,
    message: 'Connexion réussie',
    data: result
  });
});


exports.refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new ApiError(400, 'Refresh token requis');
  const result = await authService.refreshToken(refreshToken);
  res.status(200).json({ success: true, data: result });
});


exports.logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user._id);
  res.status(200).json({ success: true, message: 'Déconnexion réussie' });
});


exports.getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user._id);
  res.status(200).json({ success: true, data: user });
});


exports.changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  await authService.changePassword(req.user._id, oldPassword, newPassword);
  res.status(200).json({ success: true, message: 'Mot de passe modifié' });
});