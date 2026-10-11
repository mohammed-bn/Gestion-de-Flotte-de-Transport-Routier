const asyncHandler = require('../utils/asyncHandler');
const userService = require('../services/user.service');


exports.createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(201).json({
    success: true,
    message: 'Utilisateur créé',
    data: user
  });
});


exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers(req.query);
  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});


exports.getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.status(200).json({ success: true, data: user });
});


exports.updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: 'Utilisateur mis à jour',
    data: user
  });
});


exports.deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id);
  res.status(200).json({ success: true, message: 'Utilisateur supprimé' });
});


exports.suspendUser = asyncHandler(async (req, res) => {
  const user = await userService.changeStatus(req.params.id, 'suspendu');
  res.status(200).json({
    success: true,
    message: 'Compte suspendu',
    data: user
  });
});


exports.reactivateUser = asyncHandler(async (req, res) => {
  const user = await userService.changeStatus(req.params.id, 'actif');
  res.status(200).json({
    success: true,
    message: 'Compte réactivé',
    data: user
  });
});


exports.getMyProfile = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.user._id);
  res.status(200).json({ success: true, data: user });
});

    
exports.updateMyProfile = asyncHandler(async (req, res) => {
  
  delete req.body.role;
  delete req.body.statusUser;
  delete req.body.password;
  const user = await userService.updateUser(req.user._id, req.body);
  res.status(200).json({
    success: true,
    message: 'Profil mis à jour',
    data: user
  });
});