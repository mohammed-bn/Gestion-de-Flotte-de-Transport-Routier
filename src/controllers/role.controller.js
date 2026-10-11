const asyncHandler = require('../utils/asyncHandler');
const roleService = require('../services/role.service');


exports.createRole = asyncHandler(async (req, res) => {
  const role = await roleService.createRole(req.body);
  res.status(201).json({
    success: true,
    message: 'Rôle créé avec succès',
    data: role
  });
});


exports.getAllRoles = asyncHandler(async (req, res) => {
  const roles = await roleService.getAllRoles();
  res.status(200).json({
    success: true,
    count: roles.length,
    data: roles
  });
});


exports.getRoleById = asyncHandler(async (req, res) => {
  const role = await roleService.getRoleById(req.params.id);
  res.status(200).json({
    success: true,
    data: role
  });
});


exports.updateRole = asyncHandler(async (req, res) => {
  const role = await roleService.updateRole(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: 'Rôle mis à jour',
    data: role
  });
});


exports.deleteRole = asyncHandler(async (req, res) => {
  await roleService.deleteRole(req.params.id);
  res.status(200).json({
    success: true,
    message: 'Rôle supprimé'
  });
});